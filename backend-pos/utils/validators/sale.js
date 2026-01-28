const { query } = require('express-validator');

const validateSales = [
    query('start_date')
        .notEmpty().withMessage('Start Date is Required')
        .isISO8601().withMessage('Start Date must be a valid date'),
    query('end_date') 
        .notEmpty().withMessage('End Date is Required')
        .isISO8601().withMessage('End Date must be a valid date'),
];

module.exports = { validateSales };