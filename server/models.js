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
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(String(password), this.password)
}
const User = mongoose.model('User', UserSchema)

const StudentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  preTutor: String,
  tutor: {
    type: String,
    default: ''
  },
  tutorName: {
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
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  major: {
    type: [String],
    default: [],
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  students: {
    type: [String],
    default: []
  },
  preStudents: {
    type: [String],
    default: []
  },
  phone: String,
  email: String,
  link: String,
  comments: {
    type: [String],
    default: []
  },
  score: {
    type: [Number],
    default: []
  }
})
const Tutor = mongoose.model('Tutor', TutorSchema)

const studentsPresentSchema = new mongoose.Schema({
  id: String,
  name: String
})
const RecordSchema = new mongoose.Schema({
  tutorName: {
    type: String,
    required: true
  },
  studentsPresent: {
    type: [studentsPresentSchema],
    default: []
  },
  date: {
    type: Date,
    required: true
  },
  location: String,
  content: String,
  problem: String,
  notation: String
})
const Record = mongoose.model('Record', RecordSchema)

module.exports = { User, Student, Tutor, Record }