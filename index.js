// express 연결
const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser')
const { User } = require('./models/User')

const config = require('./config/key')

app.use(bodyParser.urlencoded({extended : true})) // x-www-form-urlencoded 분석해 가져오기
app.use(bodyParser.json()) // json타입 분석해 가져오기

// mongoose 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex :true, useFindAndModify :false 
}).then(()=> console.log('MongoDB Connected...')) 
.catch(err => console.log(err)) 

app.get('/', (req, res) => res.send('Hello World!'))

// 회원가입 라우터
app.post('/register', (req, res) => {
    // 회원가입 시 필요한 정보들을 client에서 가져오면 DB에 넣어줌
    const user = new User(req.body)

    user.save((err,userInfo)=>{
        if(err) return res.json({ success : false , err })
        return res.status(200).json({
            success : true
        })
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
