const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const xlsx = require('node-xlsx')

const { SECRETKEY } = require('./SECRETKEY')
const { User } = require('./models')
const { Upload } = require('element-ui')

const app = express()
app.use(express.json())
app.use(cors())
app.all("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  next()
})

// express中间件，用于token认证
const auth = async (req, res, next) => {
  const raw = String(req.headers.authorization).split(' ').pop()
  const { id } = jwt.verify(raw, SECRETKEY)
  req.user = await User.findById(id)
  next()
}

app.get('/', async (req, res) => {
  res.send('服务端已运行')
})

app.get('/api/getAllUsers', async (req, res) => {
  const users = await User.find()
  res.send(users)
})

app.post('/api/register', async (req, res) => {
  const { id, password } = req.body
  const user = await User.findOne({ id })
  if (user) {
    return res.status(422).send({
      message: '注册失败，用户名已存在'
    })
  }
  const newUser = await User.create({
    id,
    password
  })
  console.log(`注册成功!用户名：${id}密码：${password}`)
  res.send(req.body)
})

app.post('/api/login', async (req, res) => {
  // console.log(req.body)
  // res.send('登录成功')
  const { id, password } = req.body
  const user = await User.findOne({
    id
  })
  if (!user) {
    return res.status(422).send({
      message: '用户名不存在'
    })
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password)
  if (!isPasswordValid) {
    return res.status(422).send({
      message: '密码错误'
    })
  }

  console.log(`${id}登录成功`)
  // 生成token保持登录状态
  const token = jwt.sign({
    id: String(user._id)
  }, SECRETKEY)
  res.send({
    user,
    token
  })
})

app.post('/api/upload', upload.si)

app.post('/api/modify', auth, async(req, res) => {

})

// 需要使用认证的加auth，先执行认证
app.get('/api/info', auth, async (req, res) => {
  res.send(req.user)
})

// 获取当前老师的所有学生名单
// app.get('/api/students', auth, async (req, res) => {
//   const students = await Teacher.find().where({

//   })
// })


app.listen(3001, () => {
  console.log('开始监听http://localhost:3001')
})