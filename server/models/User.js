const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10 // saltRound를 10자리로 생성
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname :{
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
})

userSchema.pre('save',function(next){ // save 하기전에 (route의 user.save 전에)
    var user = this;
    // 비밀번호 변경시에만 암호화 실행
    if(user.isModified('password')){
        // 비밀번호 암호화 시킨다
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            });
        });
    }else{
        next()
    }
})

userSchema.methods.generateToken = function(cb){
    // jsonwebtoken을 이용해 token을 생성
    var user = this 
    var token = jwt.sign(user._id.toHexString(), 'secretToken') //user._id + 'secretToken' => token생성 ('secretToken'문자열로 복호화 해 아이디를 알수 있음)
    user.token = token // db에 생성한 token 저장
    user.save(function(err,user){
        if(err) return ch(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token , cb) {
    var user = this

    // 토큰을 decode
    jwt.verify(token,'secretToken',function(err,decoded){
        // userid를 이용해 유저를 찾아 토큰과 유저의 토큰 일치 확인
        user.findOne({"_id":decoded, "token":token},function (err,user){
            if (err) return cb(err)
            cb(null, user)
        })
    })
}

const User = mongoose.model('User',userSchema) // 스키마를 모델로 감싸줌

module.exports = { User } // 다른데서 사용할 수 있도록 export해줌