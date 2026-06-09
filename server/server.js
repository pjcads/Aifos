require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const userRoutes = require('./src/routes/userRoutes');

const authMiddleware = require('./src/middleware/authMiddleware');
const roleMiddleware = require('./src/middleware/roleMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */
app.use('/api/auth', authRoutes);

/**
 * =========================
 * PROTECTED ROUTES
 * =========================
 */

// Customers: any logged-in user
app.use('/api/customers', authMiddleware, customerRoutes);

// Products: manager + super admin
app.use(
  '/api/products',
  authMiddleware,
  roleMiddleware('MANAGER', 'ADMIN'),
  productRoutes
);

// Users: ONLY super admin
app.use(
  '/api/users',
  authMiddleware,
  roleMiddleware('ADMIN'),
  userRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});