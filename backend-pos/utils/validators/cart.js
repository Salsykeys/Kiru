const { body } = require('express-validator');

const validateCart = [
    body('product_id').notEmpty().withMessage('Product is Required'),
    body('qty').notEmpty().withMessage('Quantity is Required'),
];

module.exports = { validateCart };