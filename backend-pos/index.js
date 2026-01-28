//import
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//init app
const app = express()
app.use(cors())

// Parsing
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
