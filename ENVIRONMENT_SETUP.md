# Environment Setup Guide

This guide helps you set up environment variables for both Backend and Frontend.

## 🔧 Backend Environment Setup

1. **Copy the example file:**
   ```bash
   cd Backend
   cp .env.example .env
   ```

2. **Fill in your actual values in `.env`:**

### Database (MongoDB Atlas)
- `DB_USER`: Your MongoDB Atlas username
- `DB_PASSWORD`: Your MongoDB Atlas password  
- `DB_CLUSTER`: Your MongoDB cluster URL
- `DB_CLUSTER_NAME`: Your database name

### JWT Authentication
- `SECRET_TOKEN`: Generate a strong random string (at least 32 characters)

### Stripe Payments
- `STRIPE_API_KEY`: Your Stripe secret key (sk_test_... for testing)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook endpoint secret

### Email Service (Brevo)
- `BREVO_API_KEY`: Your Brevo API key
- `FROM_EMAIL`: Verified sender email address
- `FROM_NAME`: Sender name for emails

### File Storage (Cloudinary)
- `CLOUDINARY_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

## 🎨 Frontend Environment Setup

1. **Copy the example file:**
   ```bash
   cd FrontEnd
   cp .env.example .env
   ```

2. **Fill in your actual values in `.env`:**

### API Configuration
- `VITE_API_URL`: Backend server URL (http://localhost:8000 for development)
- `VITE_SOCKET_URL`: Socket.IO server URL (same as API URL)

### Stripe Configuration
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (pk_test_... for testing)

### Application Environment
- `VITE_APP_ENV`: Set to 'development' or 'production'

## 🔑 Getting API Keys

### MongoDB Atlas
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create database user
4. Get connection string

### Stripe
1. Sign up at [Stripe](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Set up webhook endpoint for payments

### Brevo (Email)
1. Sign up at [Brevo](https://www.brevo.com)
2. Go to SMTP & API → API Keys
3. Create new API key

### Cloudinary
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get credentials from Dashboard

## 🚨 Security Notes

- **Never commit `.env` files** to version control
- Use **different keys for development and production**
- Keep **secret keys secure** and don't share them
- Use **environment variables** in deployment platforms
- Regularly **rotate API keys** for security

## 📝 Environment Variables Checklist

### Backend Required:
- [ ] DB_USER, DB_PASSWORD, DB_CLUSTER, DB_CLUSTER_NAME
- [ ] SECRET_TOKEN
- [ ] STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET
- [ ] BREVO_API_KEY, FROM_EMAIL
- [ ] CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

### Frontend Required:
- [ ] VITE_API_URL
- [ ] VITE_STRIPE_PUBLISHABLE_KEY
- [ ] VITE_SOCKET_URL

## 🚀 Development vs Production

### Development
```env
# Backend
NODE_ENV=development
PORT=8000
FRONTEND_URL=http://localhost:5173

# Frontend  
VITE_API_URL=http://localhost:8000
```

### Production
```env
# Backend
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-frontend-domain.com

# Frontend
VITE_API_URL=https://your-backend-domain.com
```