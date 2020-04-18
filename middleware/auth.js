const { User } = require('../models/User')

let auth = (req, res, next) =>{
    // 인증 처리
    // 1. 클라이언트 쿠키에서 토큰 가져옴
    let token = req.cookies.x_auth

    // 2. 토큰 복호화 -> user 찾기
    User.findByToken(token, (err,user)=>{
        if (err) throw err
        if(!user) return res.json({isAuth : false, err : true})
    
        // user가 있을때
        req.token = token // 여기에 넣으므로서 미들웨어 끝나고 본 라우터에서 호출 가능
        req.user = user
        next()
    })
}

module.exports = {auth}