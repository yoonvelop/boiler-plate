// express 연결
const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')

const config = require('./config/key')

app.use(bodyParser.urlencoded({extended : true})) // x-www-form-urlencoded 분석해 가져오기
app.use(bodyParser.json()) // json타입 분석해 가져오기
app.use(cookieParser())

// mongoose 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex :true, useFindAndModify :false 
}).then(()=> console.log('MongoDB Connected...')) 
.catch(err => console.log(err)) 

app.get('/', (req, res) => res.send('Hello World!'))

// 회원가입 라우터
app.post('/api/users/register', (req, res) => {
    // 회원가입 시 필요한 정보들을 client에서 가져오면 DB에 넣어줌
    const user = new User(req.body)

    user.save((err,userInfo)=>{
        if(err) return res.json({ success : false , err })
        return res.status(200).json({
            success : true
        })
    })
})

// 로그인 라우터
app.post('/api/users/login', (req, res) => {
   // 1. 넘어온 이메일이 DB에 존재하는지 확인
   User.findOne({ email : req.body.email }, (err, user)=>{
       if(!user){ // 존재x 경우
           return res.json({
               loginSuccess : false,
               message : "해당 유저가 없습니다." 
           })
       }
       // 2. 존재한다면 비밀번호가 일치하는지 확인
       user.comparePassword(req.body.password, (err, isMatch)=>{ // req.body.password : 넘겨받은 비번
           if(!isMatch)
           return res.json({ loginSuccess : false, message : "비밀번호가 틀렸습니다." })
       }) 
       // 3. 비번이 맞다면 토큰 생성
       user.generateToken((err, user)=>{
            if(err) return res.status(400).send(err)

           // 토큰을 저장 (쿠키에)
            res.cookie("x_auth",user.token) //x_auth란 이름으로 쿠키 저장
            .status(200)
            .json({ loginSuccess : true, userId : user._id }) 
       })
   })
})

app.get('/api/users/auth',auth,(req,res)=>{ // auth : 미들웨어
    // 미들웨어를 통과해야 여기 올수 있으므로 아래는 auth가 있음을 의미
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role ===0 ? false :true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role : req.user.role,
        image : req.user.image
    })
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
