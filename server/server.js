const config = require('./src/config/config');

console.log(
    config.CompanyName
);

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const customerRoutes = require('./src/routes/customerRoutes')
const userRoutes = require('./src/routes/userRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const negativeInventoryApprovalRoutes = require('./src/routes/negativeInventoryApprovalRoutes');
const payrollRoutes = require('./src/routes/payrollRoutes');
const checkoutRoutes = require('./src/routes/checkoutRoutes');
const refundRoutes = require('./src/routes/refundRoutes');
const reconciliationRoutes = require('./src/routes/reconciliationRoutes');
const goodsReceiptRoutes = require('./src/routes/goodsReceiptRoutes');
const walletRoutes = require('./src/routes/walletRoutes');
const cashierSessionRoutes = require('./src/routes/cashierSessionRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const customerInquiryRoutes = require('./src/routes/customerInquiryRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const syncRoutes = require('./src/routes/syncRoutes');
const terminalRoutes = require('./src/routes/terminalRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const priceRoutes = require('./src/routes/priceRoutes');
const configurationRoutes = require('./src/routes/configurationRoutes');

const authMiddleware = require('./src/middleware/authMiddleware');
const roleMiddleware = require('./src/middleware/roleMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    '/uploads',
    express.static('uploads')
);

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

app.use(
    '/api/terminals',
    terminalRoutes
);

app.use(
    '/api/configuration',
    configurationRoutes
);

/**
 * =========================
 * AUTHENTICATED ROUTES
 * =========================
 */
app.use(
    '/api/sessions',
    authMiddleware,
    cashierSessionRoutes
);

app.use(
    '/api/transactions',
    authMiddleware,
    transactionRoutes
);

app.use(
    '/api/customer-inquiry',
    authMiddleware,
    customerInquiryRoutes
);

app.use(
    '/api/orders',
    authMiddleware,
    orderRoutes
);

app.use(
    '/api/dashboard',
    authMiddleware,
    dashboardRoutes
);

app.use(
    '/api/sync',
    authMiddleware,
    syncRoutes
);

app.use(
    '/api/categories',
    authMiddleware,
    categoryRoutes
);

app.use('/api/customers',
    authMiddleware,
    customerRoutes);

app.use(
   '/api/products',
   authMiddleware,
   productRoutes
);

app.use(
    '/api/checkout',
    authMiddleware,
    checkoutRoutes
);
/**
 * =========================
 * PROTECTED ROUTES
 * =========================
 */
// Products: manager + super admin

app.use(
    '/api/payroll',
    authMiddleware,
    roleMiddleware('ADMIN','MANAGER'),
    payrollRoutes
);

app.use('/api/refunds',
    authMiddleware,
    roleMiddleware('ADMIN','MANAGER'),
    refundRoutes
);

app.use(
  '/api/inventory',
  authMiddleware,
  roleMiddleware('ADMIN', 'MANAGER'),
  inventoryRoutes
);

app.use(
    '/api/negative-inventory-approvals',
    authMiddleware,
    roleMiddleware('ADMIN', 'MANAGER'),
    negativeInventoryApprovalRoutes
);

app.use(
    '/api/reconciliations',
    authMiddleware,
    roleMiddleware('ADMIN','MANAGER'),
    reconciliationRoutes
);    

app.use(
    '/api/goods-receipts',
    authMiddleware,
    roleMiddleware('ADMIN','MANAGER'),
    goodsReceiptRoutes
);

app.use(
    '/api/wallets',
    authMiddleware,
    roleMiddleware('ADMIN','MANAGER'),
    walletRoutes
);

app.use(
    '/api/reports',
    authMiddleware,
    roleMiddleware('ADMIN','MANAGER'),
    reportRoutes
);

app.use(
    '/api/prices',
    authMiddleware,
    roleMiddleware(
        'ADMIN',
        'MANAGER'
    ),
    priceRoutes
);

// Users: ONLY super admin
app.use(
  '/api/users',
  authMiddleware,
  roleMiddleware('ADMIN'),
  userRoutes
);

const PORT = config.Api.Port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});