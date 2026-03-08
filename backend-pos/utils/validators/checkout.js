const { body } = require('express-validator');

const validateCheckout = [
    body('amount').notEmpty().withMessage('Amount is Required'),
    body('customerName').notEmpty().withMessage('Customer Name is Required'),
    body('customerEmail').notEmpty().withMessage('Customer Email is Required'),
];

module.exports = { validateCheckout };
