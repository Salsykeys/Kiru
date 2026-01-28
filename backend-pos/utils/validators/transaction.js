const { body } = require('express-validator');

const validateTransaction = [
    body('cash').notEmpty().withMessage('Cash is Required'),
    body('grand_total').notEmpty().withMessage('Grand Total is Required'),
];

module.exports = { validateTransaction };