// Imports
const express = require('express');

// Middlewares
const { validateLogin, validateUser, validateCategory, validateProduct, validateCustomer, validateCustomerRegister, validateCart, validateTransaction, validateSales, validateProfit, validateCheckout } = require('../utils/validators');
const { handleValidationErrors, verifyToken, upload } = require('../middlewares');

// Controllers
const loginController = require('../controllers/LoginController');
const userController = require('../controllers/UserController');
const categoryController = require('../controllers/CategoryController');
const productController = require('../controllers/ProductController');
const customerController = require('../controllers/CustomerController');
const cartController = require('../controllers/CartController');
const transactionController = require('../controllers/TransactionController');
const salesController = require('../controllers/SalesController');
const profitController = require('../controllers/ProfitController');
const dashboardController = require('../controllers/DashboardController');
const checkoutController = require('../controllers/CheckoutController');

const router = express.Router();

// define routes
const routes = [
  // login
  { method: 'post', path: '/login', middlewares: [validateLogin, handleValidationErrors], handler: loginController.login },

  // user
  { method: 'get', path: '/users', middlewares: [verifyToken], handler: userController.findUser },
  { method: 'post', path: '/users', middlewares: [verifyToken, validateUser, handleValidationErrors], handler: userController.createUser },
  { method: 'get', path: '/users/:id', middlewares: [verifyToken], handler: userController.findUserById },
  { method: 'get', path: '/users/:id/transactions', middlewares: [verifyToken], handler: userController.getUserTransactions },
  { method: 'put', path: '/users/:id', middlewares: [verifyToken, validateUser, handleValidationErrors], handler: userController.updateUser },
  { method: 'delete', path: '/users/:id', middlewares: [verifyToken], handler: userController.deleteUser },

  // category
  { method: 'get', path: '/categories', middlewares: [], handler: categoryController.findCategories },
  { method: 'post', path: '/categories', middlewares: [verifyToken, upload.single('image'), validateCategory, handleValidationErrors], handler: categoryController.createCategory },
  { method: 'get', path: '/categories/:id', middlewares: [verifyToken], handler: categoryController.findCategoryById },
  { method: 'put', path: '/categories/:id', middlewares: [verifyToken, upload.single('image'), validateCategory, handleValidationErrors], handler: categoryController.updateCategory },
  { method: 'delete', path: '/categories/:id', middlewares: [verifyToken], handler: categoryController.deleteCategory },
  { method: 'get', path: '/categories-all', middlewares: [], handler: categoryController.allCategories },

  // product
  { method: 'get', path: '/products', middlewares: [], handler: productController.findProduct },
  { method: 'post', path: '/products', middlewares: [verifyToken, upload.single('image'), validateProduct, handleValidationErrors], handler: productController.createProduct },
  { method: 'get', path: '/products/:id', middlewares: [verifyToken], handler: productController.findProductById },
  { method: 'put', path: '/products/:id', middlewares: [verifyToken, upload.single('image'), validateProduct, handleValidationErrors], handler: productController.updateProduct },
  { method: 'delete', path: '/products/:id', middlewares: [verifyToken], handler: productController.deleteProduct },
  { method: 'get', path: '/products-by-category/:id', middlewares: [], handler: productController.findProductByCategoryId },
  { method: 'post', path: '/products-by-barcode', middlewares: [verifyToken], handler: productController.findProductByBarcode },

  // customer
  { method: 'post', path: '/customers/register', middlewares: [validateCustomerRegister, handleValidationErrors], handler: customerController.register },
  { method: 'post', path: '/customers/login', middlewares: [validateLogin, handleValidationErrors], handler: customerController.login },
  { method: 'get', path: '/customers/transactions', middlewares: [verifyToken], handler: customerController.getCustomerTransactions },
  { method: 'get', path: '/customers-all', middlewares: [verifyToken], handler: customerController.allCustomers },
  { method: 'get', path: '/customers', middlewares: [verifyToken], handler: customerController.findCustomer },
  { method: 'post', path: '/customers', middlewares: [verifyToken, validateCustomer, handleValidationErrors], handler: customerController.createCustomer },
  { method: 'get', path: '/customers/:id', middlewares: [verifyToken], handler: customerController.findCustomerById },
  { method: 'put', path: '/customers/:id', middlewares: [verifyToken, validateCustomer, handleValidationErrors], handler: customerController.updateCustomer },
  { method: 'delete', path: '/customers/:id', middlewares: [verifyToken], handler: customerController.deleteCustomer },

  // cart
  { method: 'get', path: '/carts', middlewares: [verifyToken], handler: cartController.findCarts },
  { method: 'post', path: '/carts', middlewares: [verifyToken, validateCart, handleValidationErrors], handler: cartController.createCart },
  { method: 'delete', path: '/carts/:id', middlewares: [verifyToken], handler: cartController.deleteCart },

  // transaction
  { method: 'post', path: '/transactions', middlewares: [verifyToken, validateTransaction, handleValidationErrors], handler: transactionController.createTransaction },
  { method: 'get', path: '/transactions', middlewares: [verifyToken], handler: transactionController.findTransactionByInvoice },

  // sales
  { method: 'get', path: '/sales', middlewares: [verifyToken, validateSales, handleValidationErrors], handler: salesController.filterSales },
  { method: 'get', path: '/sales/export', middlewares: [verifyToken, validateSales, handleValidationErrors], handler: salesController.exportSales },

  // profits
  { method: 'get', path: '/profits', middlewares: [verifyToken, validateProfit, handleValidationErrors], handler: profitController.filterProfit },
  { method: 'get', path: '/profits/export', middlewares: [verifyToken, validateProfit, handleValidationErrors], handler: profitController.exportProfit },

  // Dashboard
  { method: 'get', path: '/dashboard', middlewares: [verifyToken], handler: dashboardController.getDashboardData },

  // Checkout (Midtrans)
  { method: 'post', path: '/checkout/snap', middlewares: [verifyToken, validateCheckout, handleValidationErrors], handler: checkoutController.createSnapTransaction },
  { method: 'post', path: '/checkout/notification', middlewares: [], handler: checkoutController.handleNotification }
];

const createRoutes = (routes) => {
  routes.forEach(({ method, path, middlewares, handler }) => {
    router[method](path, ...middlewares, handler);
  });
};

createRoutes(routes);

module.exports = router;