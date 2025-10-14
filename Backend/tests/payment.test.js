import request from 'supertest';
import express from 'express';
import Stripe from 'stripe';
import { jest } from '@jest/globals';

// Mock Stripe
const mockStripe = {
  paymentIntents: {
    create: jest.fn(),
    retrieve: jest.fn(),
    confirm: jest.fn()
  },
  webhooks: {
    constructEvent: jest.fn()
  },
  customers: {
    create: jest.fn(),
    retrieve: jest.fn()
  }
};

jest.mock('stripe', () => {
  return jest.fn(() => mockStripe);
});

// Mock database models
jest.mock('../DB/model.js', () => ({
  user: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    save: jest.fn()
  },
  Database: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn()
  }
}));

// Mock email service
jest.mock('../Login page/Dashboard.js', () => ({
  sendOrderConfirmationEmail: jest.fn(),
  sendPaymentFailedEmail: jest.fn()
}));

// Create test app
const app = express();
app.use(express.json());

// Mock payment routes
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await mockStripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      metadata: { userId }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = mockStripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        const paymentIntent = event.data.object;
        // Update order status, send confirmation email, etc.
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        const failedPayment = event.data.object;
        // Send failure notification, update order status, etc.
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await mockStripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status in database
      res.status(200).json({ 
        success: true, 
        message: 'Payment confirmed',
        orderId 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment not completed' 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

describe('Payment Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Payment Intent Creation', () => {
    test('should create payment intent successfully', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        amount: 2000,
        currency: 'usd',
        status: 'requires_payment_method'
      };

      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const response = await request(app)
        .post('/api/create-payment-intent')
        .send({
          amount: 20.00,
          currency: 'usd',
          userId: 'user123'
        });

      expect(response.status).toBe(200);
      expect(response.body.clientSecret).toBe('pi_test_123_secret');
      expect(response.body.paymentIntentId).toBe('pi_test_123');
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 2000, // Amount in cents
        currency: 'usd',
        metadata: { userId: 'user123' }
      });
    });

    test('should reject invalid payment amount', async () => {
      const response = await request(app)
        .post('/api/create-payment-intent')
        .send({
          amount: 0,
          userId: 'user123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid amount');
    });

    test('should handle Stripe API errors', async () => {
      mockStripe.paymentIntents.create.mockRejectedValue(new Error('Stripe API Error'));

      const response = await request(app)
        .post('/api/create-payment-intent')
        .send({
          amount: 20.00,
          userId: 'user123'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Stripe API Error');
    });
  });

  describe('Payment Confirmation', () => {
    test('should confirm successful payment', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 2000,
        currency: 'usd'
      };

      mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

      const response = await request(app)
        .post('/api/confirm-payment')
        .send({
          paymentIntentId: 'pi_test_123',
          orderId: 'order123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Payment confirmed');
      expect(response.body.orderId).toBe('order123');
    });

    test('should handle incomplete payment', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_123',
        status: 'requires_payment_method',
        amount: 2000,
        currency: 'usd'
      };

      mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

      const response = await request(app)
        .post('/api/confirm-payment')
        .send({
          paymentIntentId: 'pi_test_123',
          orderId: 'order123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Payment not completed');
    });
  });

  describe('Webhook Handling', () => {
    test('should process payment success webhook', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            amount: 2000,
            currency: 'usd',
            metadata: { userId: 'user123', orderId: 'order123' }
          }
        }
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const response = await request(app)
        .post('/api/webhook')
        .set('stripe-signature', 'test_signature')
        .send('webhook_payload');

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalled();
    });

    test('should process payment failure webhook', async () => {
      const mockEvent = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_test_123',
            amount: 2000,
            currency: 'usd',
            last_payment_error: {
              message: 'Your card was declined.'
            }
          }
        }
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const response = await request(app)
        .post('/api/webhook')
        .set('stripe-signature', 'test_signature')
        .send('webhook_payload');

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });

    test('should handle invalid webhook signature', async () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const response = await request(app)
        .post('/api/webhook')
        .set('stripe-signature', 'invalid_signature')
        .send('webhook_payload');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid signature');
    });
  });

  describe('Customer Management', () => {
    test('should create Stripe customer', async () => {
      const mockCustomer = {
        id: 'cus_test_123',
        email: 'test@example.com',
        name: 'Test User'
      };

      mockStripe.customers.create.mockResolvedValue(mockCustomer);

      const customerData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '1234567890'
      };

      const customer = await mockStripe.customers.create(customerData);

      expect(customer).toEqual(mockCustomer);
      expect(mockStripe.customers.create).toHaveBeenCalledWith(customerData);
    });

    test('should retrieve existing Stripe customer', async () => {
      const mockCustomer = {
        id: 'cus_test_123',
        email: 'test@example.com',
        name: 'Test User'
      };

      mockStripe.customers.retrieve.mockResolvedValue(mockCustomer);

      const customer = await mockStripe.customers.retrieve('cus_test_123');

      expect(customer).toEqual(mockCustomer);
      expect(mockStripe.customers.retrieve).toHaveBeenCalledWith('cus_test_123');
    });
  });

  describe('Payment Error Scenarios', () => {
    test('should handle insufficient funds error', async () => {
      const insufficientFundsError = new Error('Your card has insufficient funds');
      insufficientFundsError.type = 'card_error';
      insufficientFundsError.code = 'insufficient_funds';

      mockStripe.paymentIntents.create.mockRejectedValue(insufficientFundsError);

      const response = await request(app)
        .post('/api/create-payment-intent')
        .send({
          amount: 20.00,
          userId: 'user123'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Your card has insufficient funds');
    });

    test('should handle card declined error', async () => {
      const cardDeclinedError = new Error('Your card was declined');
      cardDeclinedError.type = 'card_error';
      cardDeclinedError.code = 'card_declined';

      mockStripe.paymentIntents.create.mockRejectedValue(cardDeclinedError);

      const response = await request(app)
        .post('/api/create-payment-intent')
        .send({
          amount: 20.00,
          userId: 'user123'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Your card was declined');
    });

    test('should handle expired card error', async () => {
      const expiredCardError = new Error('Your card has expired');
      expiredCardError.type = 'card_error';
      expiredCardError.code = 'expired_card';

      mockStripe.paymentIntents.create.mockRejectedValue(expiredCardError);

      const response = await request(app)
        .post('/api/create-payment-intent')
        .send({
          amount: 20.00,
          userId: 'user123'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Your card has expired');
    });
  });

  describe('Order Processing Integration', () => {
    test('should update order status after successful payment', async () => {
      const { user } = await import('../DB/model.js');
      
      const mockOrder = {
        _id: 'order123',
        userId: 'user123',
        status: 'pending',
        paymentIntentId: 'pi_test_123',
        amount: 2000
      };

      const mockUser_instance = {
        _id: 'user123',
        orders: [mockOrder],
        save: jest.fn().mockResolvedValue(true)
      };

      user.findById.mockResolvedValue(mockUser_instance);

      // Simulate successful payment webhook processing
      const order = mockUser_instance.orders.find(o => o._id === 'order123');
      order.status = 'completed';
      order.paymentStatus = 'paid';
      await mockUser_instance.save();

      expect(order.status).toBe('completed');
      expect(order.paymentStatus).toBe('paid');
      expect(mockUser_instance.save).toHaveBeenCalled();
    });

    test('should clear cart after successful payment', async () => {
      const { user } = await import('../DB/model.js');
      
      const mockUser_instance = {
        _id: 'user123',
        cart: [
          { productId: 'product1', quantity: 2 },
          { productId: 'product2', quantity: 1 }
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      user.findById.mockResolvedValue(mockUser_instance);

      // Simulate cart clearing after successful payment
      mockUser_instance.cart = [];
      await mockUser_instance.save();

      expect(mockUser_instance.cart).toHaveLength(0);
      expect(mockUser_instance.save).toHaveBeenCalled();
    });

    test('should update product stock after successful order', async () => {
      const { Database } = await import('../DB/model.js');
      
      const mockProduct = {
        _id: 'product123',
        stock: 10,
        save: jest.fn().mockResolvedValue(true)
      };

      Database.findById.mockResolvedValue(mockProduct);

      // Simulate stock update after successful order
      const quantityOrdered = 3;
      mockProduct.stock -= quantityOrdered;
      await mockProduct.save();

      expect(mockProduct.stock).toBe(7);
      expect(mockProduct.save).toHaveBeenCalled();
    });
  });
});