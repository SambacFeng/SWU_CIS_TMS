const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost:27017/DBM-server', {
  useCreateIndex: true,
  useNewUrlParser: true
}).then(() => {
  console.log('连接数据库成功')
})

const UserSchema = new mongoose.Schema({
  // 用户名，管理员为admin，教师和学生为教工号/学号
  id: {
    type: String,
    unique: true
  },
  // 密码，初始状态下与用户名一致
  password: {
    type: String,
    set(val) {
      return bcrypt.hashSync(val, 4)
    }
  }
})
const User = mongoose.model('User', UserSchema)

module.exports = { User }