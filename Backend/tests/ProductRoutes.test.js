import request from 'supertest';
import express from 'express';
import ProductRouter from '../Routes/ProductRoutes.js';
import { jest } from '@jest/globals';

// Mock all the dependencies
jest.mock('../Login page/Dashboard.js', () => ({
  addProduct: jest.fn(),
  listProducts: jest.fn(),
  deleteProduct: jest.fn(),
  listPublicProducts: jest.fn(),
  editProduct: jest.fn(),
  addProfile: jest.fn(),
  fetchProfile: jest.fn(),
  sendEmail: jest.fn()
}));

jest.mock('../Login page/CartModel.js', () => ({
  addToCart: jest.fn(),
  updateCart: jest.fn(),
  getUserCart: jest.fn(),
  deleteFromCart: jest.fn()
}));

jest.mock('../Middleware/Multer.js', () => ({
  fields: jest.fn(() => (req, res, next) => next())
}));

jest.mock('../Middleware/adminAuth.js', () => jest.fn((req, res, next) => next()));

// Create test app
const app = express();
app.use(express.json());
app.use('/api', ProductRouter);

describe('Product Routes API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/addProducts', () => {
    test('should add a new product with valid admin token', async () => {
      const { addProduct } = await import('../Login page/Dashboard.js');
      addProduct.mockImplementation((req, res) => {
        res.status(201).json({ success: true, message: 'Product added successfully' });
      });

      const response = await request(app)
        .post('/api/addProducts')
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          category: '1'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(addProduct).toHaveBeenCalled();
    });

    test('should reject product addition without admin auth', async () => {
      const adminAuth = await import('../Middleware/adminAuth.js');
      adminAuth.default.mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      const response = await request(app)
        .post('/api/addProducts')
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          category: '1'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/products', () => {
    test('should list products for admin', async () => {
      const { listProducts } = await import('../Login page/Dashboard.js');
      listProducts.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          products: [
            { _id: '1', name: 'Product 1', price: 99.99 },
            { _id: '2', name: 'Product 2', price: 149.99 }
          ]
        });
      });

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.products).toHaveLength(2);
      expect(listProducts).toHaveBeenCalled();
    });
  });

  describe('GET /api/public-products', () => {
    test('should list public products without authentication', async () => {
      const { listPublicProducts } = await import('../Login page/Dashboard.js');
      listPublicProducts.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          products: [
            { _id: '1', name: 'Public Product 1', price: 99.99 },
            { _id: '2', name: 'Public Product 2', price: 149.99 }
          ]
        });
      });

      const response = await request(app).get('/api/public-products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.products).toHaveLength(2);
      expect(listPublicProducts).toHaveBeenCalled();
    });

    test('should handle empty products list', async () => {
      const { listPublicProducts } = await import('../Login page/Dashboard.js');
      listPublicProducts.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          products: []
        });
      });

      const response = await request(app).get('/api/public-products');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(0);
    });
  });

  describe('PUT /api/edit/:id', () => {
    test('should edit product with admin auth', async () => {
      const { editProduct } = await import('../Login page/Dashboard.js');
      editProduct.mockImplementation((req, res) => {
        res.status(200).json({ success: true, message: 'Product updated successfully' });
      });

      const response = await request(app)
        .put('/api/edit/product123')
        .send({
          name: 'Updated Product',
          price: 199.99
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(editProduct).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/delete/:id', () => {
    test('should delete product with admin auth', async () => {
      const { deleteProduct } = await import('../Login page/Dashboard.js');
      deleteProduct.mockImplementation((req, res) => {
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
      });

      const response = await request(app).delete('/api/delete/product123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(deleteProduct).toHaveBeenCalled();
    });
  });

  describe('Cart Routes', () => {
    describe('POST /api/cart/add', () => {
      test('should add item to cart', async () => {
        const { addToCart } = await import('../Login page/CartModel.js');
        addToCart.mockImplementation((req, res) => {
          res.status(200).json({ success: true, message: 'Item added to cart' });
        });

        const response = await request(app)
          .post('/api/cart/add')
          .send({
            userId: 'user123',
            productId: 'product123',
            quantity: 2
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(addToCart).toHaveBeenCalled();
      });
    });

    describe('GET /api/cart', () => {
      test('should get user cart', async () => {
        const { getUserCart } = await import('../Login page/CartModel.js');
        getUserCart.mockImplementation((req, res) => {
          res.status(200).json({
            success: true,
            cart: {
              'item1': { _id: 'item1', name: 'Product 1', quantity: 2, price: 99.99 }
            }
          });
        });

        const response = await request(app)
          .get('/api/cart')
          .query({ userId: 'user123' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(getUserCart).toHaveBeenCalled();
      });
    });

    describe('PUT /api/cart/update/:itemId', () => {
      test('should update cart item quantity', async () => {
        const { updateCart } = await import('../Login page/CartModel.js');
        updateCart.mockImplementation((req, res) => {
          res.status(200).json({ success: true, message: 'Cart updated successfully' });
        });

        const response = await request(app)
          .put('/api/cart/update/item123')
          .send({
            userId: 'user123',
            quantity: 3
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(updateCart).toHaveBeenCalled();
      });
    });

    describe('DELETE /api/cart/delete/:itemId', () => {
      test('should remove item from cart', async () => {
        const { deleteFromCart } = await import('../Login page/CartModel.js');
        deleteFromCart.mockImplementation((req, res) => {
          res.status(200).json({ success: true, message: 'Item removed from cart' });
        });

        const response = await request(app).delete('/api/cart/delete/item123');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(deleteFromCart).toHaveBeenCalled();
      });
    });
  });

  describe('Profile Routes', () => {
    describe('POST /api/profile', () => {
      test('should add profile with admin auth', async () => {
        const { addProfile } = await import('../Login page/Dashboard.js');
        addProfile.mockImplementation((req, res) => {
          res.status(201).json({ success: true, message: 'Profile created successfully' });
        });

        const response = await request(app)
          .post('/api/profile')
          .send({
            name: 'Test Profile',
            description: 'Test Description'
          });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(addProfile).toHaveBeenCalled();
      });
    });

    describe('GET /api/userProfile', () => {
      test('should fetch user profile with admin auth', async () => {
        const { fetchProfile } = await import('../Login page/Dashboard.js');
        fetchProfile.mockImplementation((req, res) => {
          res.status(200).json({
            success: true,
            profile: { name: 'Test Profile', description: 'Test Description' }
          });
        });

        const response = await request(app).get('/api/userProfile');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(fetchProfile).toHaveBeenCalled();
      });
    });
  });

  describe('POST /api/send-email', () => {
    test('should send email successfully', async () => {
      const { sendEmail } = await import('../Login page/Dashboard.js');
      sendEmail.mockImplementation((req, res) => {
        res.status(200).json({ success: true, message: 'Email sent successfully' });
      });

      const response = await request(app)
        .post('/api/send-email')
        .send({
          to: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test Message'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(sendEmail).toHaveBeenCalled();
    });

    test('should handle email sending failure', async () => {
      const { sendEmail } = await import('../Login page/Dashboard.js');
      sendEmail.mockImplementation((req, res) => {
        res.status(500).json({ success: false, message: 'Failed to send email' });
      });

      const response = await request(app)
        .post('/api/send-email')
        .send({
          to: 'invalid-email',
          subject: 'Test Subject',
          message: 'Test Message'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});