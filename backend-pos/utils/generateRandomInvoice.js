function generateRandomInvoice (prefix = 'INV') {
    
    const timeStamp = Date.now();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `${prefix}-${timeStamp}-${randomNum}`;
    return invoiceNumber;
}

module.exports = { generateRandomInvoice };