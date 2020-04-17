// express 연결
const express = require('express')
const app = express()
const port = 5000

// mongoose 연결
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yoonvelop:qwer1234@boilerplate-it5ke.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex :true, useFindAndModify :false 
}).then(()=> console.log('MongoDB Connected...')) 
.catch(err => console.log(err)) 

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
