const { body } = require('express-validator');

const validateCustomer = [
    body('name').notEmpty().withMessage('Name is Required'),
    body('email').notEmpty().withMessage('Email is Required').isEmail().withMessage('Email is Invalid'),
    body('password').if(body('password').exists()).isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('no_telp').notEmpty().withMessage('No. Telp is Required'),
    body('address').notEmpty().withMessage('Address is Required'),
];

const validateCustomerRegister = [
    body('name').notEmpty().withMessage('Name is Required'),
    body('email').notEmpty().withMessage('Email is Required').isEmail().withMessage('Email is Invalid'),
    body('password').notEmpty().withMessage('Password is Required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('no_telp').notEmpty().withMessage('No. Telp is Required'),
    body('address').notEmpty().withMessage('Address is Required'),
];

module.exports = { validateCustomer, validateCustomerRegister };