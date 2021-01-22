const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'quanlybanhang'
})
db.connect((err)=>{
    if(err) console.log(err.message)
    else console.log('Server đã kết nối cơ sở dữ liệu')
  })
module.exports = db