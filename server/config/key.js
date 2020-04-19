if(process.env.NODE_ENV === 'production'){ // 배포 : production, 로컬 : development 라고 뜨는 전역변수 
    module.exports = require('./prod'); // 배포 버전이면 prod.js 파일로
}else{
    module.exports = require('./dev');  // 개발 버전이면 dev.js 파일로
} 