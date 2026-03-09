
//import
const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes');

//init appo
const app = express()
app.use(cors());

// Parsing
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', router);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Catcher:", err);
    res.status(500).json({
        meta: { success: false, message: 'Unhandled Internal Server Error' },
        error_message: err.message,
        error_stack: err.stack
    });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server Running at http://localhost:${port}`);
    });
}

// Export the Express API untuk Vercel Serverless
module.exports = app;
