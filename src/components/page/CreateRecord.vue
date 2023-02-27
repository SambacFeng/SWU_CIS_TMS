<template>
  <div class="container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="导师姓名" prop="tutorName">
        <el-input v-model="form.tutorName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="指导学生" prop="studentsPresent">
        <el-checkbox v-model="checkedAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="form.studentsPresent">
          <el-checkbox v-for="student in students" :key="student.id" :label="student.id">
            {{ student.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="面谈时间" prop="date">
        <el-date-picker v-model="form.date" type="date" placeholder="选择面谈时间"
          :picker-options="pickerOptions"></el-date-picker>
      </el-form-item>
      <el-form-item label="面谈地点" prop="location">
        <el-input v-model="form.location" placeholder="请输入地点"></el-input>
      </el-form-item>
      <el-form-item label="主要内容" prop="content">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" v-model="form.content"
          placeholder="面谈的主要内容"></el-input>
      </el-form-item>
      <el-form-item label="问题及思路" prop="problem">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" v-model="form.problem"
          placeholder="学生提出的主要问题及解决思路"></el-input>
      </el-form-item>
      <el-form-item label="情况说明">
        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 5 }" v-model="form.notation"
          placeholder="未参加学生情况说明"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { get, post } from '../../api'
export default {
  data() {
    return {
      checkedAll: false,
      form: {
        tutorName: localStorage.getItem('name'),
        studentsPresent: [],
        date: '',
        location: '',
        content: '',
        problem: '',
        notation: ''
      },
      students: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }]
      },
      rules: {
        tutorName: [{ required: true, message: '请输入导师名称', trigger: 'blur' }],
        studentsPresent: [{ type: 'array', required: true, message: '请至少选择一个学生', trigger: 'change' }],
        date: [{ type: 'date', required: true, message: '指导时间', trigger: 'change' }],
        location: [{ required: true, message: '请输入指导地点', trigger: 'blur' }],
        content: [{ required: true, message: '主要内容不能为空', trigger: 'blur' }],
        problem: [{ required: true, message: '问题及思路不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    get('getStudents', { id: localStorage.getItem('id') })
      .then(res => {
        this.students = res.data
        console.log(this.students)
      })
  },
  methods: {
    // handleCheckboxChange(checkedValues) {
    //   // console.log('Selected students:', checkedValues)
    //   const selectedStudents = checkedValues.map(id => {
    //     const student = this.students.find(stu => stu.id === id)
    //     return {
    //       id: student.id,
    //       name: student.name
    //     }
    //   })
    //   console.log('Selected students:', selectedStudents)
    //   this.studentsPresent = selectedStudents
    // },
    handleCheckAllChange(val) {
      // if (checked) {
      //   this.studentsPresent = this.students.map(student => {
      //     return {
      //       id: student.id,
      //       name: student.name
      //     }
      //   })
      // } else {
      //   this.studentsPresent = []
      // }
      this.form.studentsPresent = val ? this.students.map(student => student.id) : []
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const studentsPresent = this.form.studentsPresent.map(stuId => {
            const student = this.students.find(stu => stu.id === stuId)
            return {
              id: student.id,
              name: student.name
            }
          })
          this.form.studentsPresent = studentsPresent
          console.log(this.form)
          // 提交表单代码
          post('createRecord', this.form)
            .then(() => {
              this.$message.success('提交指导记录成功')
            })
        }
      })
    }
  }
}
</script>