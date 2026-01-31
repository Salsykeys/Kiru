// Imports
const express = require('express');
const { validateLogin, validateUser, validateCategory, validateProduct } = require('../utils/validators');
const { handleValidationErrors, verifyToken, upload } = require('../middlewares');
const loginController = require('../controllers/LoginController');
const userController = require('../controllers/UserController');
const categoryController = require('../controllers/CategoryController');
const productController = require('../controllers/ProductController');

const router = express.Router();

// define routes
const routes = [
  // login
  { method: 'post', path: '/login', middlewares: [validateLogin, handleValidationErrors], handler: loginController.login },

  // user
  { method: 'get', path: '/users', middlewares: [verifyToken], handler: userController.findUser },
  { method: 'post', path: '/users', middlewares: [verifyToken, validateUser, handleValidationErrors], handler: userController.createUser },
  { method: 'get', path: '/users/:id', middlewares: [verifyToken], handler: userController.findUserById },
  { method: 'put', path: '/users/:id', middlewares: [verifyToken, validateUser, handleValidationErrors], handler: userController.updateUser },
  { method: 'delete', path: '/users/:id', middlewares: [verifyToken], handler: userController.deleteUser },

  // category
  { method: 'get', path: '/categories', middlewares: [verifyToken], handler: categoryController.findCategories },
  { method: 'post', path: '/categories', middlewares: [verifyToken, upload.single('image'), validateCategory, handleValidationErrors], handler: categoryController.createCategory },
  { method: 'get', path: '/categories/:id', middlewares: [verifyToken], handler: categoryController.findCategoryById },
  { method: 'put', path: '/categories/:id', middlewares: [verifyToken, upload.single('image'), validateCategory, handleValidationErrors], handler: categoryController.updateCategory },
  { method: 'delete', path: '/categories/:id', middlewares: [verifyToken], handler: categoryController.deleteCategory },
  { method: 'get', path: '/categories-all', middlewares: [verifyToken], handler: categoryController.allCategories },

  // product
  { method: 'get', path: '/products', middlewares: [verifyToken], handler: productController.findProduct },
  { method: 'post', path: '/products', middlewares: [verifyToken, upload.single('image'), validateProduct, handleValidationErrors], handler: productController.createProduct },
  { method: 'get', path: '/products/:id', middlewares: [verifyToken], handler: productController.findProductById },
  { method: 'put', path: '/products/:id', middlewares: [verifyToken, upload.single('image'), validateProduct, handleValidationErrors], handler: productController.updateProduct },
  { method: 'delete', path: '/products/:id', middlewares: [verifyToken], handler: productController.deleteProduct },
  { method: 'get', path: '/products-by-category/:id', middlewares: [verifyToken], handler: productController.findProductByCategoryId },
  { method: 'post', path: '/products-by-barcode', middlewares: [verifyToken], handler: productController.findProductByBarcode },

];

const createRoutes = (routes) => {
  routes.forEach(({ method, path, middlewares, handler }) => {
    router[method](path, ...middlewares, handler);
  });
};

createRoutes(routes);

module.exports = router;