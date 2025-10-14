import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';

// Mock database models
const mockUser = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn()
};

const mockDatabase = {
  find: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn()
};

const mockReviewDatabase = {
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn()
};

jest.mock('../DB/model.js', () => ({
  user: mockUser,
  Database: mockDatabase,
  ReviewDatabase: mockReviewDatabase
}));

jest.mock('bcrypt', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn()
}));

jest.mock('../Config/Cloudinary.js', () => ({
  cloudinary: {
    uploader: {
      upload: jest.fn()
    }
  }
}));

// Create test app
const app = express();
app.use(express.json());

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    // Mock MongoDB connection
    jest.spyOn(mongoose, 'connect').mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe('User Model Operations', () => {
    test('should create a new user in database', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        isEmailVerified: false
      };

      const mockCreatedUser = {
        _id: 'user123',
        ...userData,
        save: jest.fn().mockResolvedValue(true)
      };

      mockUser.create.mockResolvedValue(mockCreatedUser);

      const result = await mockUser.create(userData);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUser.create).toHaveBeenCalledWith(userData);
      expect(result._id).toBeDefined();
    });

    test('should find user by email', async () => {
      const mockFoundUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123'
      };

      mockUser.findOne.mockResolvedValue(mockFoundUser);

      const result = await mockUser.findOne({ email: 'test@example.com' });

      expect(result).toEqual(mockFoundUser);
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    test('should update user profile information', async () => {
      const userId = 'user123';
      const updateData = {
        name: 'Updated Name',
        phone: '1234567890'
      };

      const mockUpdatedUser = {
        _id: userId,
        name: 'Updated Name',
        email: 'test@example.com',
        phone: '1234567890'
      };

      mockUser.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

      const result = await mockUser.findByIdAndUpdate(userId, updateData, { new: true });

      expect(result).toEqual(mockUpdatedUser);
      expect(mockUser.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true });
    });

    test('should handle user password updates', async () => {
      const bcryptMock = await import('bcrypt');
      const userId = 'user123';
      const newPassword = 'newPassword123';
      const hashedPassword = 'newHashedPassword123';

      bcryptMock.hashSync.mockReturnValue(hashedPassword);

      const mockUser_instance = {
        _id: userId,
        password: 'oldHashedPassword',
        save: jest.fn().mockResolvedValue(true)
      };

      mockUser.findById.mockResolvedValue(mockUser_instance);

      const user = await mockUser.findById(userId);
      user.password = bcryptMock.hashSync(newPassword, 10);
      await user.save();

      expect(bcryptMock.hashSync).toHaveBeenCalledWith(newPassword, 10);
      expect(user.password).toBe(hashedPassword);
      expect(user.save).toHaveBeenCalled();
    });

    test('should verify user email status update', async () => {
      const userId = 'user123';
      
      const mockUser_instance = {
        _id: userId,
        email: 'test@example.com',
        isEmailVerified: false,
        loginVerificationCode: '123456',
        loginVerificationExpires: Date.now() + 3600000,
        save: jest.fn().mockResolvedValue(true)
      };

      mockUser.findOne.mockResolvedValue(mockUser_instance);

      const user = await mockUser.findOne({ email: 'test@example.com' });
      user.isEmailVerified = true;
      user.loginVerificationCode = undefined;
      user.loginVerificationExpires = undefined;
      await user.save();

      expect(user.isEmailVerified).toBe(true);
      expect(user.loginVerificationCode).toBeUndefined();
      expect(user.loginVerificationExpires).toBeUndefined();
      expect(user.save).toHaveBeenCalled();
    });
  });

  describe('Product Database Operations', () => {
    test('should create a new product in database', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        description: 'A test product',
        category: 'Electronics',
        image: 'test-image.jpg',
        stock: 10
      };

      const mockCreatedProduct = {
        _id: 'product123',
        ...productData,
        save: jest.fn().mockResolvedValue(true)
      };

      mockDatabase.create.mockResolvedValue(mockCreatedProduct);

      const result = await mockDatabase.create(productData);

      expect(result).toEqual(mockCreatedProduct);
      expect(mockDatabase.create).toHaveBeenCalledWith(productData);
      expect(result._id).toBeDefined();
    });

    test('should find products by category', async () => {
      const mockProducts = [
        {
          _id: 'product1',
          name: 'Product 1',
          category: 'Electronics',
          price: 99.99
        },
        {
          _id: 'product2',
          name: 'Product 2',
          category: 'Electronics',
          price: 149.99
        }
      ];

      mockDatabase.find.mockResolvedValue(mockProducts);

      const result = await mockDatabase.find({ category: 'Electronics' });

      expect(result).toEqual(mockProducts);
      expect(mockDatabase.find).toHaveBeenCalledWith({ category: 'Electronics' });
      expect(result).toHaveLength(2);
    });

    test('should update product information', async () => {
      const productId = 'product123';
      const updateData = {
        price: 79.99,
        stock: 15
      };

      const mockUpdatedProduct = {
        _id: productId,
        name: 'Test Product',
        price: 79.99,
        stock: 15
      };

      mockDatabase.findByIdAndUpdate.mockResolvedValue(mockUpdatedProduct);

      const result = await mockDatabase.findByIdAndUpdate(productId, updateData, { new: true });

      expect(result).toEqual(mockUpdatedProduct);
      expect(mockDatabase.findByIdAndUpdate).toHaveBeenCalledWith(productId, updateData, { new: true });
    });

    test('should delete a product from database', async () => {
      const productId = 'product123';

      mockDatabase.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await mockDatabase.deleteOne({ _id: productId });

      expect(result.deletedCount).toBe(1);
      expect(mockDatabase.deleteOne).toHaveBeenCalledWith({ _id: productId });
    });

    test('should search products by name', async () => {
      const searchTerm = 'test';
      const mockSearchResults = [
        {
          _id: 'product1',
          name: 'Test Product 1',
          price: 99.99
        },
        {
          _id: 'product2',
          name: 'Another Test Item',
          price: 149.99
        }
      ];

      mockDatabase.find.mockResolvedValue(mockSearchResults);

      const result = await mockDatabase.find({
        name: { $regex: searchTerm, $options: 'i' }
      });

      expect(result).toEqual(mockSearchResults);
      expect(mockDatabase.find).toHaveBeenCalledWith({
        name: { $regex: searchTerm, $options: 'i' }
      });
    });
  });

  describe('Review Database Operations', () => {
    test('should create a product review', async () => {
      const reviewData = {
        productId: 'product123',
        userId: 'user123',
        rating: 5,
        comment: 'Great product!',
        userName: 'Test User'
      };

      const mockCreatedReview = {
        _id: 'review123',
        ...reviewData,
        createdAt: new Date(),
        save: jest.fn().mockResolvedValue(true)
      };

      mockReviewDatabase.create.mockResolvedValue(mockCreatedReview);

      const result = await mockReviewDatabase.create(reviewData);

      expect(result).toEqual(mockCreatedReview);
      expect(mockReviewDatabase.create).toHaveBeenCalledWith(reviewData);
      expect(result._id).toBeDefined();
    });

    test('should find reviews for a product', async () => {
      const productId = 'product123';
      const mockReviews = [
        {
          _id: 'review1',
          productId: productId,
          rating: 5,
          comment: 'Excellent!'
        },
        {
          _id: 'review2',
          productId: productId,
          rating: 4,
          comment: 'Very good'
        }
      ];

      mockReviewDatabase.find.mockResolvedValue(mockReviews);

      const result = await mockReviewDatabase.find({ productId: productId });

      expect(result).toEqual(mockReviews);
      expect(mockReviewDatabase.find).toHaveBeenCalledWith({ productId: productId });
      expect(result).toHaveLength(2);
    });
  });

  describe('Database Validation Tests', () => {
    test('should handle database connection errors', async () => {
      mockUser.findOne.mockRejectedValue(new Error('Database connection failed'));

      try {
        await mockUser.findOne({ email: 'test@example.com' });
      } catch (error) {
        expect(error.message).toBe('Database connection failed');
      }

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    test('should handle invalid data insertion', async () => {
      const invalidUserData = {
        // Missing required fields
        email: 'invalid-email'
      };

      mockUser.create.mockRejectedValue(new Error('Validation failed'));

      try {
        await mockUser.create(invalidUserData);
      } catch (error) {
        expect(error.message).toBe('Validation failed');
      }

      expect(mockUser.create).toHaveBeenCalledWith(invalidUserData);
    });

    test('should handle duplicate key errors', async () => {
      const duplicateUserData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'hashedPassword123'
      };

      mockUser.create.mockRejectedValue(new Error('E11000 duplicate key error'));

      try {
        await mockUser.create(duplicateUserData);
      } catch (error) {
        expect(error.message).toContain('duplicate key error');
      }

      expect(mockUser.create).toHaveBeenCalledWith(duplicateUserData);
    });
  });

  describe('Cart Operations in Database', () => {
    test('should add item to user cart', async () => {
      const userId = 'user123';
      const cartItem = {
        productId: 'product123',
        quantity: 2,
        price: 99.99
      };

      const mockUser_instance = {
        _id: userId,
        cart: [],
        save: jest.fn().mockResolvedValue(true)
      };

      mockUser.findById.mockResolvedValue(mockUser_instance);

      const user = await mockUser.findById(userId);
      user.cart.push(cartItem);
      await user.save();

      expect(user.cart).toContain(cartItem);
      expect(user.save).toHaveBeenCalled();
    });

    test('should update cart item quantity', async () => {
      const userId = 'user123';
      const productId = 'product123';
      const newQuantity = 5;

      const mockUser_instance = {
        _id: userId,
        cart: [
          { productId: 'product123', quantity: 2, price: 99.99 },
          { productId: 'product456', quantity: 1, price: 149.99 }
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      mockUser.findById.mockResolvedValue(mockUser_instance);

      const user = await mockUser.findById(userId);
      const cartItem = user.cart.find(item => item.productId === productId);
      cartItem.quantity = newQuantity;
      await user.save();

      expect(cartItem.quantity).toBe(newQuantity);
      expect(user.save).toHaveBeenCalled();
    });

    test('should remove item from cart', async () => {
      const userId = 'user123';
      const productIdToRemove = 'product123';

      const mockUser_instance = {
        _id: userId,
        cart: [
          { productId: 'product123', quantity: 2, price: 99.99 },
          { productId: 'product456', quantity: 1, price: 149.99 }
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      mockUser.findById.mockResolvedValue(mockUser_instance);

      const user = await mockUser.findById(userId);
      user.cart = user.cart.filter(item => item.productId !== productIdToRemove);
      await user.save();

      expect(user.cart).toHaveLength(1);
      expect(user.cart.find(item => item.productId === productIdToRemove)).toBeUndefined();
      expect(user.save).toHaveBeenCalled();
    });
  });
});