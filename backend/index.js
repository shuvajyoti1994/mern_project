const connectToMongo = require('./db');
connectToMongo();

const express = require("express")
const app = express()
var cors = require('cors')
app.use(cors())
const port = 5000

app.use(express.json())

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req,res)=>{
    res.send('Hello Wrold')
})

app.listen(port, ()=>{
    console.log(`eNotebook app listening at port:${port}`);
})