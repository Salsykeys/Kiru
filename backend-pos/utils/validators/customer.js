const { body } = require('express-validator');

const validateCustomer = [
    body('name').notEmpty().withMessage('Name is Required'),
    body('no_telp').notEmpty().withMessage('No. Telp is Required'),
    body('address').notEmpty().withMessage('Address is Required'),
];

module.exports = { validateCustomer };