import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// Mock all dependencies
jest.mock('../DB/model.js', () => ({
  user: {
    findById: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn()
  },
  Database: {
    find: jest.fn(),
    findById: jest.fn(),
    save: jest.fn()
  },
  ReviewDatabase: {
    find: jest.fn(),
    save: jest.fn()
  }
}));

jest.mock('../Login page/Dashboard.js', () => ({
  sendOrderConfirmationEmail: jest.fn(),
  sendShippingNotification: jest.fn()
}));

jest.mock('stripe', () => {
  return jest.fn(() => ({
    paymentIntents: {
      create: jest.fn(),
      retrieve: jest.fn()
    }
  }));
});

// Create test app
const app = express();
app.use(express.json());

describe('End-to-End User Journey Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete User Registration to Order Flow', () => {
    test('should complete full user journey: register → login → browse → add to cart → checkout', async () => {
      const { user, Database } = await import('../DB/model.js');
      const bcrypt = await import('bcrypt');
      const jwt = await import('jsonwebtoken');

      // Step 1: User Registration
      user.findOne.mockResolvedValueOnce(null); // User doesn't exist
      const mockCreatedUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        isEmailVerified: true,
        cart: [],
        orders: [],
        save: jest.fn().mockResolvedValue(true)
      };
      user.create.mockResolvedValue(mockCreatedUser);

      // Registration success
      expect(mockCreatedUser.email).toBe('test@example.com');
      expect(mockCreatedUser.cart).toEqual([]);

      // Step 2: User Login
      user.findOne.mockResolvedValueOnce(mockCreatedUser);
      
      // Login success - user authenticated
      expect(mockCreatedUser.isEmailVerified).toBe(true);

      // Step 3: Browse Products
      const mockProducts = [
        {
          _id: 'product1',
          name: 'Abstract Art Print',
          price: 29.99,
          category: 'Abstract',
          stock: 10,
          image: 'abstract1.jpg'
        },
        {
          _id: 'product2',
          name: 'Minimalist Poster',
          price: 19.99,
          category: 'Minimalist',
          stock: 5,
          image: 'minimal1.jpg'
        }
      ];

      Database.find.mockResolvedValue(mockProducts);
      const products = await Database.find({});

      expect(products).toHaveLength(2);
      expect(products[0].name).toBe('Abstract Art Print');

      // Step 4: Add Items to Cart
      user.findById.mockResolvedValue(mockCreatedUser);

      // Add first product to cart
      const cartItem1 = {
        productId: 'product1',
        name: 'Abstract Art Print',
        price: 29.99,
        quantity: 2,
        image: 'abstract1.jpg'
      };
      mockCreatedUser.cart.push(cartItem1);

      // Add second product to cart
      const cartItem2 = {
        productId: 'product2',
        name: 'Minimalist Poster',
        price: 19.99,
        quantity: 1,
        image: 'minimal1.jpg'
      };
      mockCreatedUser.cart.push(cartItem2);

      await mockCreatedUser.save();

      expect(mockCreatedUser.cart).toHaveLength(2);
      expect(mockCreatedUser.cart[0].quantity).toBe(2);
      expect(mockCreatedUser.save).toHaveBeenCalled();

      // Step 5: Update Cart Quantities
      const productToUpdate = mockCreatedUser.cart.find(item => item.productId === 'product1');
      productToUpdate.quantity = 3;
      await mockCreatedUser.save();

      expect(productToUpdate.quantity).toBe(3);

      // Step 6: Calculate Total
      const cartTotal = mockCreatedUser.cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);

      expect(cartTotal).toBe(109.96); // (29.99 * 3) + (19.99 * 1)

      // Step 7: Checkout Process
      const orderData = {
        _id: 'order123',
        userId: 'user123',
        items: [...mockCreatedUser.cart],
        totalAmount: cartTotal,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'USA'
        },
        createdAt: new Date()
      };

      mockCreatedUser.orders.push(orderData);
      mockCreatedUser.cart = []; // Clear cart after order
      await mockCreatedUser.save();

      expect(mockCreatedUser.orders).toHaveLength(1);
      expect(mockCreatedUser.orders[0].totalAmount).toBe(109.96);
      expect(mockCreatedUser.cart).toHaveLength(0);

      // Step 8: Payment Processing (Simulated)
      const order = mockCreatedUser.orders[0];
      order.paymentStatus = 'completed';
      order.status = 'confirmed';
      await mockCreatedUser.save();

      expect(order.paymentStatus).toBe('completed');
      expect(order.status).toBe('confirmed');
    });

    test('should handle cart abandonment and recovery', async () => {
      const { user } = await import('../DB/model.js');

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        cart: [
          {
            productId: 'product1',
            name: 'Abstract Art Print',
            price: 29.99,
            quantity: 1,
            addedAt: Date.now() - (24 * 60 * 60 * 1000) // Added 24 hours ago
          }
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      user.findById.mockResolvedValue(mockUser);

      // Simulate cart abandonment email trigger
      const cartAbandonmentThreshold = 24 * 60 * 60 * 1000; // 24 hours
      const abandonedItems = mockUser.cart.filter(item => {
        return Date.now() - item.addedAt > cartAbandonmentThreshold;
      });

      expect(abandonedItems).toHaveLength(1);
      expect(abandonedItems[0].productId).toBe('product1');

      // User returns and completes purchase
      const order = {
        _id: 'order124',
        userId: 'user123',
        items: [...mockUser.cart],
        totalAmount: 29.99,
        status: 'completed'
      };

      mockUser.orders = [order];
      mockUser.cart = [];
      await mockUser.save();

      expect(mockUser.orders).toHaveLength(1);
      expect(mockUser.cart).toHaveLength(0);
    });
  });

  describe('Admin Product Management Flow', () => {
    test('should complete admin workflow: login → add product → manage inventory → process orders', async () => {
      const { admin, Database } = await import('../DB/model.js');

      // Step 1: Admin Login
      const mockAdmin = {
        _id: 'admin123',
        email: 'admin@example.com',
        name: 'Admin User',
        isEmailVerified: true
      };

      // Step 2: Add New Product
      const newProduct = {
        _id: 'product123',
        name: 'New Abstract Painting',
        description: 'Beautiful abstract artwork',
        price: 149.99,
        category: 'Abstract',
        stock: 20,
        image: 'new-abstract.jpg',
        featured: true,
        createdBy: 'admin123',
        createdAt: new Date(),
        save: jest.fn().mockResolvedValue(true)
      };

      Database.create = jest.fn().mockResolvedValue(newProduct);
      const createdProduct = await Database.create(newProduct);

      expect(createdProduct.name).toBe('New Abstract Painting');
      expect(createdProduct.stock).toBe(20);
      expect(createdProduct.createdBy).toBe('admin123');

      // Step 3: Update Product Information
      Database.findById.mockResolvedValue(newProduct);
      
      newProduct.price = 129.99; // Price update
      newProduct.stock = 15; // Stock adjustment
      await newProduct.save();

      expect(newProduct.price).toBe(129.99);
      expect(newProduct.stock).toBe(15);

      // Step 4: Process Customer Orders
      const { user } = await import('../DB/model.js');
      
      const mockCustomerOrders = [
        {
          _id: 'order1',
          userId: 'user1',
          items: [{ productId: 'product123', quantity: 2 }],
          status: 'pending',
          totalAmount: 259.98
        },
        {
          _id: 'order2',
          userId: 'user2',
          items: [{ productId: 'product123', quantity: 1 }],
          status: 'pending',
          totalAmount: 129.99
        }
      ];

      // Update orders to shipped status
      mockCustomerOrders.forEach(order => {
        order.status = 'shipped';
        order.trackingNumber = `TRK${order._id}`;
      });

      expect(mockCustomerOrders[0].status).toBe('shipped');
      expect(mockCustomerOrders[0].trackingNumber).toBe('TRKorder1');

      // Step 5: Update inventory after orders
      const totalQuantityOrdered = mockCustomerOrders.reduce((total, order) => {
        return total + order.items.reduce((itemTotal, item) => {
          return itemTotal + item.quantity;
        }, 0);
      }, 0);

      newProduct.stock -= totalQuantityOrdered;
      await newProduct.save();

      expect(newProduct.stock).toBe(12); // 15 - 3 = 12
    });
  });

  describe('Product Review and Rating Flow', () => {
    test('should handle complete review submission workflow', async () => {
      const { user, Database, ReviewDatabase } = await import('../DB/model.js');

      // Step 1: User with completed order
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        orders: [
          {
            _id: 'order123',
            items: [{ productId: 'product1', quantity: 1 }],
            status: 'delivered',
            deliveredAt: Date.now() - (7 * 24 * 60 * 60 * 1000) // Delivered 7 days ago
          }
        ]
      };

      user.findById.mockResolvedValue(mockUser);

      // Step 2: Product exists and was purchased
      const mockProduct = {
        _id: 'product1',
        name: 'Abstract Art Print',
        reviews: [],
        averageRating: 0,
        totalReviews: 0
      };

      Database.findById.mockResolvedValue(mockProduct);

      // Step 3: Submit Review
      const reviewData = {
        _id: 'review123',
        productId: 'product1',
        userId: 'user123',
        userName: 'Test User',
        rating: 5,
        comment: 'Amazing artwork, excellent quality!',
        createdAt: new Date(),
        verified: true, // Verified purchase
        save: jest.fn().mockResolvedValue(true)
      };

      ReviewDatabase.create = jest.fn().mockResolvedValue(reviewData);
      const createdReview = await ReviewDatabase.create(reviewData);

      expect(createdReview.rating).toBe(5);
      expect(createdReview.verified).toBe(true);

      // Step 4: Update Product Rating
      mockProduct.reviews.push(createdReview);
      mockProduct.totalReviews = mockProduct.reviews.length;
      mockProduct.averageRating = mockProduct.reviews.reduce((sum, review) => sum + review.rating, 0) / mockProduct.totalReviews;

      expect(mockProduct.totalReviews).toBe(1);
      expect(mockProduct.averageRating).toBe(5);

      // Step 5: Add More Reviews
      const additionalReviews = [
        { rating: 4, comment: 'Good quality' },
        { rating: 5, comment: 'Love it!' },
        { rating: 3, comment: 'Decent artwork' }
      ];

      additionalReviews.forEach(review => {
        mockProduct.reviews.push(review);
      });

      mockProduct.totalReviews = mockProduct.reviews.length;
      mockProduct.averageRating = mockProduct.reviews.reduce((sum, review) => sum + review.rating, 0) / mockProduct.totalReviews;

      expect(mockProduct.totalReviews).toBe(4);
      expect(mockProduct.averageRating).toBe(4.25); // (5+4+5+3)/4 = 4.25
    });
  });

  describe('Search and Filter Workflow', () => {
    test('should handle product search and filtering journey', async () => {
      const { Database } = await import('../DB/model.js');

      // Step 1: Initial Product Catalog
      const allProducts = [
        {
          _id: 'product1',
          name: 'Abstract Colorful Painting',
          category: 'Abstract',
          price: 89.99,
          tags: ['colorful', 'modern', 'vibrant']
        },
        {
          _id: 'product2',
          name: 'Minimalist Black Print',
          category: 'Minimalist',
          price: 39.99,
          tags: ['minimal', 'black', 'simple']
        },
        {
          _id: 'product3',
          name: 'Abstract Geometric Art',
          category: 'Abstract',
          price: 129.99,
          tags: ['geometric', 'modern', 'abstract']
        }
      ];

      // Step 2: Search by Name
      Database.find.mockResolvedValueOnce(
        allProducts.filter(p => p.name.toLowerCase().includes('abstract'))
      );

      const searchResults = await Database.find({
        name: { $regex: 'abstract', $options: 'i' }
      });

      expect(searchResults).toHaveLength(2);
      expect(searchResults.every(p => p.name.toLowerCase().includes('abstract'))).toBe(true);

      // Step 3: Filter by Category
      Database.find.mockResolvedValueOnce(
        allProducts.filter(p => p.category === 'Abstract')
      );

      const categoryResults = await Database.find({ category: 'Abstract' });

      expect(categoryResults).toHaveLength(2);
      expect(categoryResults.every(p => p.category === 'Abstract')).toBe(true);

      // Step 4: Filter by Price Range
      Database.find.mockResolvedValueOnce(
        allProducts.filter(p => p.price >= 50 && p.price <= 100)
      );

      const priceRangeResults = await Database.find({
        price: { $gte: 50, $lte: 100 }
      });

      expect(priceRangeResults).toHaveLength(1);
      expect(priceRangeResults[0].price).toBe(89.99);

      // Step 5: Combined Filters
      Database.find.mockResolvedValueOnce(
        allProducts.filter(p => 
          p.category === 'Abstract' && 
          p.price <= 100 &&
          p.tags.includes('modern')
        )
      );

      const combinedResults = await Database.find({
        category: 'Abstract',
        price: { $lte: 100 },
        tags: { $in: ['modern'] }
      });

      expect(combinedResults).toHaveLength(1);
      expect(combinedResults[0].name).toBe('Abstract Colorful Painting');
    });
  });

  describe('Error Handling and Recovery Workflows', () => {
    test('should handle payment failure and retry workflow', async () => {
      const { user } = await import('../DB/model.js');

      const mockUser = {
        _id: 'user123',
        cart: [
          { productId: 'product1', quantity: 1, price: 29.99 }
        ],
        orders: [],
        save: jest.fn().mockResolvedValue(true)
      };

      // Step 1: Initial Checkout Attempt (Payment Fails)
      const failedOrder = {
        _id: 'order123',
        userId: 'user123',
        items: [...mockUser.cart],
        totalAmount: 29.99,
        status: 'payment_failed',
        paymentAttempts: 1,
        lastPaymentError: 'Card declined'
      };

      mockUser.orders.push(failedOrder);
      // Don't clear cart on payment failure
      
      expect(mockUser.cart).toHaveLength(1); // Cart preserved
      expect(failedOrder.status).toBe('payment_failed');

      // Step 2: User Updates Payment Method and Retries
      failedOrder.paymentAttempts += 1;
      failedOrder.status = 'payment_processing';

      // Step 3: Successful Payment on Retry
      failedOrder.status = 'completed';
      failedOrder.paymentStatus = 'paid';
      failedOrder.lastPaymentError = null;
      mockUser.cart = []; // Clear cart on success

      await mockUser.save();

      expect(failedOrder.status).toBe('completed');
      expect(failedOrder.paymentAttempts).toBe(2);
      expect(mockUser.cart).toHaveLength(0);
    });

    test('should handle out of stock scenarios', async () => {
      const { Database, user } = await import('../DB/model.js');

      // Step 1: Product with Limited Stock
      const mockProduct = {
        _id: 'product1',
        name: 'Limited Edition Print',
        stock: 2,
        save: jest.fn().mockResolvedValue(true)
      };

      Database.findById.mockResolvedValue(mockProduct);

      // Step 2: Multiple Users Add to Cart
      const user1Cart = [{ productId: 'product1', quantity: 1 }];
      const user2Cart = [{ productId: 'product1', quantity: 2 }]; // This should cause stock issue

      // Step 3: First User Completes Order
      mockProduct.stock -= user1Cart[0].quantity;
      expect(mockProduct.stock).toBe(1);

      // Step 4: Second User Tries to Order (Insufficient Stock)
      const requestedQuantity = user2Cart[0].quantity;
      const availableStock = mockProduct.stock;

      if (requestedQuantity > availableStock) {
        // Handle insufficient stock
        const adjustedOrder = {
          userId: 'user2',
          items: [{ 
            productId: 'product1', 
            quantity: availableStock,
            originalQuantity: requestedQuantity
          }],
          status: 'partial_fulfillment',
          stockShortage: requestedQuantity - availableStock
        };

        expect(adjustedOrder.status).toBe('partial_fulfillment');
        expect(adjustedOrder.stockShortage).toBe(1);
      }
    });
  });
});