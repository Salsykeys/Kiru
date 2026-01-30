// Imports
const express = require('express');
const { validateLogin, validateUser, validateCategory } = require('../utils/validators');
const { handleValidationErrors, verifyToken, upload } = require('../middlewares');
const loginController = require('../controllers/LoginController');
const userController = require('../controllers/UserController');
const categoryController = require('../controllers/CategoryController');

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
  { method: 'get', path: '/category', middlewares: [verifyToken], handler: categoryController.findCategories },
  { method: 'post', path: '/category', middlewares: [verifyToken, upload.single('image'), validateCategory, handleValidationErrors], handler: categoryController.createCategory },
  { method: 'get', path: '/category/:id', middlewares: [verifyToken], handler: categoryController.findCategoryById },
  { method: 'put', path: '/category/:id', middlewares: [verifyToken, upload.single('image'), validateCategory, handleValidationErrors], handler: categoryController.updateCategory },
  { method: 'delete', path: '/category/:id',middlewares: [verifyToken], handler: categoryController.deleteCategory },
];

const createRoutes = (routes) => {
    routes.forEach(({ method, path, middlewares, handler }) => {
        router[method](path, ...middlewares, handler);
    });
};  

createRoutes(routes);

module.exports = router;