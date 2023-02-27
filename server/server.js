const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const xlsx = require('node-xlsx')
const multer = require('multer')

// 处理文件
const upload = multer()

// 导入密钥
const { SECRETKEY } = require('./SECRETKEY')

// 导入MongoDB模型
const { User, Student, Tutor } = require('./models')

const app = express()
app.use(express.json())

// 解决跨域
app.use(cors())
app.all("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  next()
})

// express中间件，用于token认证
const auth = async (req, res, next) => {
  const raw = String(req.headers.authorization).split(' ').pop()
  // console.log('jwt token的值是', raw)
  const { id } = jwt.verify(raw, SECRETKEY)
  // console.log('解码后的用户id是', id)
  req.user = await User.findById(id)
  console.log('这个用户是', req.user.id)
  next()
}

app.get('/', async (req, res) => {
  res.send('服务端已运行')
})

app.get('/api/getAllUsers', async (req, res) => {
  const users = await User.find()
  res.send(users)
})

app.get('/api/studentsInfo', async (req, res) => {
  console.log('请求学生信息')
  const students = await Student.find({})
  res.json(students)
  // res.send('学生信息已发送')
})

app.get('/api/TutorsInfo', async (req, res) => {
  console.log('请求导师信息')
  const tutors = await Tutor.find({})
  res.json(tutors)
  // res.send('学生信息已发送')
})

// 导师获取全部预选学生信息
app.get('/api/preStudents', async (req, res) => {
  const students = await Student.find({ preTutor: req.query.id })
  res.json(students)
})

// 导师获取全部正式学生信息
app.get('/api/getStudents', async (req, res) => {
  const students = await Student.find({ tutor: req.query.id })
  res.json(students)
})

// 获取单个用户信息
app.get('/api/info', async (req, res) => {
  const { type, id } = req.query
  console.log('请求了', id, '的信息')
  const table = type == '1' ? Student : Tutor
  const userInfo = await table.findOne({ id })
  res.send(userInfo)
})

// 注册
const register = async (id, password, role = '1') => {
  console.log('reg', id, password, role)
  const isExist = await User.findOne({ id })
  if (!isExist) {
    const newUser = await User.create({
      id,
      password,
      role: role || '1'
    })
    console.log(`注册成功!用户名：${id}密码：${password}`)
  }
}
app.post('/api/register', async (req, res) => {
  // const { id, password } = req.body
  register(id, password)
  // const user = await User.findOne({ id })
  // if (user) {
  //   return res.status(422).send({
  //     message: '注册失败，用户名已存在'
  //   })
  // }
  // const newUser = await User.create({
  //   id,
  //   password
  // })
  // console.log(`注册成功!用户名：${id}密码：${password}`)
  res.send(req.body)
})

// 登录
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
  console.log(id, password, typeof password)
  const isPasswordValid = user.comparePassword(password)
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
  return res.send({
    user,
    token
  })
})

// 下载excel模板
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename
  console.log(`收到下载${filename}的请求`)
  res.download(`./../public/${filename}`)
})

// 处理excel上传请求
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const { file } = req
    const fileName = file.originalname.split('.').shift()
    let table = null
    if (fileName.startsWith('student')) {
      table = Student
      console.log('student被上传')
    } else if (fileName.startsWith('tutor')) {
      table = Tutor
      console.log('tutor被上传')
    }
    const workbook = xlsx.parse(file.buffer)
    const worksheet = workbook[0]
    const data = worksheet.data.slice(1)
    // 第一行作为键名
    const keys = data.shift()
    // console.log(data)
    const records = data.map(async (row) => {
      const record = {}
      row.forEach((cell, index) => {
        if (fileName === 'tutor' && keys[index] == 'major') {
          cell = cell.split(',')
        }
        record[keys[index]] = cell
      })
      // console.log(record)
      await table.findOne({ id: record.id }, async (err, res) => {
        if (err) {
          console.log(err)
        } else if (res) {
          console.warn(record.name, '的数据已存在')
        } else {
          await table.create(record, (err, res) => {
            if (err) {
              console.log(err)
            } else {
              console.log(record.name, '的数据写入成功', res)
            }
          })
          register(
            record.id,
            record.id,
            fileName.startsWith('student') ? '1' : '2'
          )
          // await User.create({
          //   id: record.id,
          //   password: record.id,
          //   role: fileName.startsWith('student') ? '1' : '2'
          // }, (err, res) => {
          //   if (err) {
          //     console.log(err)
          //   } else {
          //     console.log(`用户${record.name}的数据写入成功`, res)
          //   }
          // })
        }
      })
      return record
    })
    /* Student.insertMany(records).then(() => {
        res.send('上传成功')
      }).catch(err => {
        console.log(err)
        res.status(500).send(err.message)
      }) */
    return res.send('上传成功')
  } catch (err) {
    console.log(err)
    return res.status(500).send('处理上传文件失败，请检查文件和内容并重试')
  }
})

// 修改用户密码
app.post('/api/modifyPassword', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const { user } = req
  console.log(req.body)
  const isOldPasswordValid = user.comparePassword(oldPassword)
  if (isOldPasswordValid) {
    console.log('原密码是对的')
    user.password = newPassword
    await user.save()

  } else {
    console.log('原密码不对')
    res.status(401).send('原密码错误，修改失败')
  }
  return res.send('密码修改成功，下次登录时请使用新密码')
})

// 重置密码
app.post('/api/resetPassword', auth, async (req, res) => {
  const { id } = req.body
  // console.log(req.body)
  const { user } = req
  if (user.id !== 'admin') {
    return res.status(501).send('非管理员不能操作')
  }
  const targetUser = await User.findOne({ id })
  targetUser.password = id
  await targetUser.save()
  console.log(id, '的密码重置成功')
  return res.send('密码重置成功')
})

// 删除用户
app.post('/api/deleteUser', auth, async (req, res) => {
  const { id, type } = req.body
  const { user } = req
  if (user.id !== 'admin') {
    return res.status(501).send('非管理员不能操作')
  }
  try {
    const user = await User.findOneAndDelete({ id })
    if (!user) {
      res.status(404).send('要删除的用户不存在')
    } else {
      const table = type === '1' ? Student : Tutor
      await table.findOneAndDelete({ id })
      console.log(id, '已删除')
      res.send('删除成功')
    }
  } catch (error) {
    res.status(500).send('删除失败，服务器出错')
  }
})

// 选择导师
app.post('/api/select', async (req, res) => {
  const { studentId, tutorId } = req.body
  console.log(studentId, '想选', tutorId)
  const tutor = await Tutor.findOne({ id: tutorId })
  const student = await Student.findOne({ id: studentId })
  if (tutor.students.length + tutor.preStudents.length >= 15) {
    return res.status(403).send('导师已被选满')
  } else if (student.tutor || student.preTutor) {
    return res.status(403).send('您已选过导师，无需再选')
  } else {
    tutor.preStudents.push(studentId)
    student.preTutor = tutorId
    await tutor.save()
    await student.save()
    return res.send('选择成功，请等待导师确认，若导师长时间未确认请与导师联系')
  }
  console.log(tutor.students.length)
})

// 导师反选学生
app.post('/api/confirm', async (req, res) => {
  const { studentId, tutorId } = req.body
  console.log(tutorId, '确认选', studentId)
  const tutor = await Tutor.findOne({ id: tutorId })
  const student = await Student.findOne({ id: studentId })
  if (student.preTutor == '') {
    return res.status(403).send('您已选择过该学生，无需再选')
  } else {
    student.preTutor = ''
    student.tutor = tutorId
    const index = tutor.preStudents.indexOf(studentId)
    if (index !== -1) {
      tutor.preStudents.splice(index, 1)
    }
    tutor.students.push(studentId)
    await student.save()
    await tutor.save()
    return res.send('已成功选择')
  }
})

// 导师拒绝学生
app.post('/api/refuse', async (req, res) => {
  const { studentId, tutorId } = req.body
  console.log(tutorId, '拒绝选', studentId)
  const tutor = await Tutor.findOne({ id: tutorId })
  const student = await Student.findOne({ id: studentId })
  student.preTutor = ''
  const index = tutor.preStudents.indexOf(studentId)
  if (index !== -1) {
    tutor.preStudents.splice(index, 1)
  }
  await student.save()
  await tutor.save()
  return res.send('已成功拒绝')
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