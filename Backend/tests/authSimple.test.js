import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// Mock dependencies
const mockUser = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn()
};

const mockAdmin = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn()
};

const mockBcrypt = {
  hashSync: jest.fn(),
  compareSync: jest.fn()
};

const mockJwt = {
  sign: jest.fn(),
  verify: jest.fn()
};

jest.mock('../DB/model.js', () => ({
  user: mockUser,
  admin: mockAdmin
}), { virtual: true });

jest.mock('bcrypt', () => mockBcrypt, { virtual: true });
jest.mock('jsonwebtoken', () => mockJwt, { virtual: true });

// Create test app
const app = express();
app.use(express.json());

// Mock authentication routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({ message: 'Password does not match' });
    }

    const existingUser = await mockUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already Exists' });
    }

    const hashedPassword = mockBcrypt.hashSync(password, 10);
    const newUser = await mockUser.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: newUser._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await mockUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = mockBcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        requiresVerification: true,
        message: 'Email verification required'
      });
    }

    const token = mockJwt.sign({ userId: user._id }, 'secret_key');
    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await mockUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.loginVerificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (Date.now() > user.loginVerificationExpires) {
      return res.status(400).json({ message: 'Verification code expired' });
    }

    user.isEmailVerified = true;
    user.loginVerificationCode = undefined;
    user.loginVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed' });
  }
});

describe('Authentication API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/register', () => {
    test('should register a new user successfully', async () => {
      mockUser.findOne.mockResolvedValue(null); // User doesn't exist
      mockUser.create.mockResolvedValue({
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com'
      });
      mockBcrypt.hashSync.mockReturnValue('hashedPassword123');

      const response = await request(app)
        .post('/api/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmpassword: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('registered successfully');
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockBcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
    });

    test('should reject registration with mismatched passwords', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmpassword: 'differentpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password does not match');
    });

    test('should reject registration for existing user', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'existing123',
        email: 'test@example.com'
      });

      const response = await request(app)
        .post('/api/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmpassword: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username already Exists');
    });
  });

  describe('POST /api/login', () => {
    test('should login user with valid credentials', async () => {
      const mockUserData = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword123',
        isEmailVerified: true
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      mockBcrypt.compareSync.mockReturnValue(true);
      mockJwt.sign.mockReturnValue('jwt-token-123');

      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBe('jwt-token-123');
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockBcrypt.compareSync).toHaveBeenCalledWith('password123', 'hashedPassword123');
    });

    test('should reject login with invalid credentials', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword123'
      });
      mockBcrypt.compareSync.mockReturnValue(false);

      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid');
    });

    test('should reject login for non-existent user', async () => {
      mockUser.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('User not found');
    });

    test('should require email verification for unverified users', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword123',
        isEmailVerified: false
      });
      mockBcrypt.compareSync.mockReturnValue(true);

      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.requiresVerification).toBe(true);
    });
  });

  describe('POST /api/verify-email', () => {
    test('should verify email with valid code', async () => {
      const mockUserData = {
        _id: 'user123',
        email: 'test@example.com',
        loginVerificationCode: '123456',
        loginVerificationExpires: Date.now() + 3600000,
        isEmailVerified: false,
        save: jest.fn().mockResolvedValue(true)
      };

      mockUser.findOne.mockResolvedValue(mockUserData);

      const response = await request(app)
        .post('/api/verify-email')
        .send({
          email: 'test@example.com',
          code: '123456'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserData.isEmailVerified).toBe(true);
      expect(mockUserData.save).toHaveBeenCalled();
    });

    test('should reject verification with invalid code', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'user123',
        email: 'test@example.com',
        loginVerificationCode: '123456',
        loginVerificationExpires: Date.now() + 3600000
      });

      const response = await request(app)
        .post('/api/verify-email')
        .send({
          email: 'test@example.com',
          code: '999999'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid verification code');
    });

    test('should reject verification with expired code', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'user123',
        email: 'test@example.com',
        loginVerificationCode: '123456',
        loginVerificationExpires: Date.now() - 3600000 // Expired
      });

      const response = await request(app)
        .post('/api/verify-email')
        .send({
          email: 'test@example.com',
          code: '123456'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('expired');
    });
  });

  describe('Authentication Flow Integration', () => {
    test('should complete full registration and login flow', async () => {
      // Step 1: Register user
      mockUser.findOne.mockResolvedValueOnce(null);
      mockUser.create.mockResolvedValue({
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        isEmailVerified: false
      });
      mockBcrypt.hashSync.mockReturnValue('hashedPassword123');

      const registerResponse = await request(app)
        .post('/api/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmpassword: 'password123'
        });

      expect(registerResponse.status).toBe(201);

      // Step 2: Verify email
      const mockUserForVerification = {
        _id: 'user123',
        email: 'test@example.com',
        loginVerificationCode: '123456',
        loginVerificationExpires: Date.now() + 3600000,
        isEmailVerified: false,
        save: jest.fn().mockResolvedValue(true)
      };

      mockUser.findOne.mockResolvedValueOnce(mockUserForVerification);

      const verifyResponse = await request(app)
        .post('/api/verify-email')
        .send({
          email: 'test@example.com',
          code: '123456'
        });

      expect(verifyResponse.status).toBe(200);

      // Step 3: Login with verified account
      mockUser.findOne.mockResolvedValueOnce({
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword123',
        isEmailVerified: true
      });
      mockBcrypt.compareSync.mockReturnValue(true);
      mockJwt.sign.mockReturnValue('jwt-token-123');

      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.token).toBeDefined();
    });
  });
});