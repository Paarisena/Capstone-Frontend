# Art Vista Gallery - Frontend

Modern React.js frontend for Art Vista Gallery e-commerce platform built with Vite.

## Features
- User authentication & registration
- Product catalog with categories (Abstract, Minimalist, Wabi-Sabi)
- Shopping cart & checkout
- Stripe payment integration
- Order management
- Admin dashboard
- Responsive design (Bootstrap)
- Real-time notifications (Socket.IO)

## Tech Stack
- React.js 18
- Vite (Build tool)
- React Router DOM (Navigation)
- Redux Toolkit (State management)
- Bootstrap 5 (UI Framework)
- Stripe (Payments)
- Axios (API calls)
- Socket.IO Client (Real-time)
- React Toastify (Notifications)

## Quick Setup

1. **Install dependencies**
```bash
npm install
```

2. **Environment Variables**
Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_SOCKET_URL=http://localhost:5000
```

3. **Start development server**
```bash
npm run dev
```
Application runs on http://localhost:5173

4. **Build for production**
```bash
npm run build
```

## Project Structure
```
FrontEnd/
├── src/
│   ├── Component/          # Reusable components
│   │   ├── HomePage.jsx    # Landing page
│   │   ├── login.jsx       # User login
│   │   ├── Registration.jsx # User registration
│   │   ├── Dashboard.jsx   # Admin dashboard
│   │   ├── AdminLogin.jsx  # Admin login
│   │   └── ...
│   ├── Pages/              # Main pages
│   │   ├── Collections.jsx # Product collections
│   │   ├── Products.jsx    # Product details
│   │   ├── Cart.jsx        # Shopping cart
│   │   ├── Payment.jsx     # Payment page
│   │   ├── About.jsx       # About page
│   │   └── ...
│   ├── Layout/             # Layout components
│   │   ├── Layout.jsx      # Main layout
│   │   └── AdminLayout.jsx # Admin layout
│   ├── NavBar/             # Navigation
│   │   ├── Nav.jsx         # Main navbar
│   │   └── Sidebar.jsx     # Admin sidebar
│   ├── Protected Route/    # Route protection
│   ├── assets/             # Images & static files
│   ├── App.jsx             # Main app component
│   ├── Constant.js         # API constants
│   └── main.jsx            # App entry point
├── public/                 # Public assets
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features

### User Features
- Browse art collections by category
- User registration and authentication
- Add/remove items from cart
- Secure checkout with Stripe
- View order history
- User profile management

### Admin Features
- Admin dashboard
- Product management (CRUD)
- Order management
- User management
- Real-time notifications

### Categories
- **Abstract**: Modern abstract artworks
- **Minimalist**: Clean, simple designs
- **Wabi-Sabi**: Japanese aesthetic philosophy

## API Integration
Frontend communicates with backend via REST API:
- Base URL: `http://localhost:5000`
- Authentication: JWT tokens
- Payment: Stripe integration
- Real-time: Socket.IO connection

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Build the project
2. Upload `dist` folder
3. Set environment variables
4. Configure redirects for SPA

### Environment Variables for Production
```env
VITE_API_URL=https://your-backend-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
VITE_SOCKET_URL=https://your-backend-domain.com
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contact
- **Developer**: Paarisena Chakravarthy Gabriel
- **Email**: support@avgallery.shop
