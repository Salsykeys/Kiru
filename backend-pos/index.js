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

app.get('/uploads/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'uploads', req.params.filename));
});

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});
