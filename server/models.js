const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost:27017/DBM-server', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('连接数据库成功')
})

// 用户数据库，用于登录
const UserSchema = new mongoose.Schema({
  // 用户名，管理员为admin，教师和学生为教工号/学号
  id: {
    type: String,
    unique: true
  },
  // 密码，初始状态下与用户名一致，使用bcrypt加密
  password: {
    type: String,
    set(val) {
      return bcrypt.hashSync(String(val), 4)
    }
  },
  role: String
})
UserSchema.methods.comparePassword = function(password) {
  // console.log(password, typeof password, this.password, typeof this.password)
  return bcrypt.compareSync(String(password), this.password)
}
// UserSchema.methods.updatePassword = function(newPassword) {
//   console.log(`${this.id}的密码修改为${newPassword}`)
//   this.password = bcrypt.hashSync(String(newPassword), 4)
//   this.save()
// }
// UserSchema.methods.resetPassword = function() {
//   console.log(`${this.id}的密码被重置`)
//   this.password = bcrypt.hashSync(this.id, 4)
// }
const User = mongoose.model('User', UserSchema)

const StudentSchema = new mongoose.Schema({
  id: { 
    type: String,
    unique: true
  },
  name: String,
  major: String,
  grade: String,
  tutor: {
    type: String,
    default: ''
  },
  phone: String,
  email: String
})
const Student = mongoose.model('Student', StudentSchema)

const TutorSchema = new mongoose.Schema({
  id: { 
    type: String,
    unique: true
  },
  name: String,
  major: {
    type: [String],
    default: []
  },
  students: {
    type: [String],
    default: []
  },
  phone: String,
  email: String,
  link: String,
  comments: {
    type: [String],
    default: []
  }
})
const Tutor = mongoose.model('Tutor', TutorSchema)

module.exports = { User, Student, Tutor }