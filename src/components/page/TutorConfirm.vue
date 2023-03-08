<template>
  <div class="container">
    <div>
      <el-table :data="preStudents" style="width: 100%" highlight-current-row>
        <el-table-column prop="name" label="姓名" min-width="120" sortable></el-table-column>
        <el-table-column prop="major" label="专业" min-width="140" sortable></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
        <el-table-column prop="phone" label="联系电话" min-width="100"></el-table-column>
        <el-table-column label="操作" min-width="90">
          <template slot-scope="scope">
            <el-button type="text" @click="handleAccept(scope.$index)" :disabled="scope.row.disabled">接受</el-button>
            <el-button class="text-button-danger" type="text" @click="handleRefuse(scope.$index)"
              :disabled="scope.row.disabled">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { get, post } from '../../api'
export default {
  data() {
    return {
      userInfo: {},
      preStudents: [],
      id: localStorage.getItem('id'),
      type: localStorage.getItem('role')
    }
  },
  created() {
    this.getUserInfo()
    this.getPreStudentsInfo(this.id)
  },
  methods: {
    getUserInfo() {
      get('info', { type: this.type, id: this.id }).then(res => {
        console.log(res)
        this.userInfo = res.data
      })
    },
    getPreStudentsInfo(id) {
      get('preStudents', { id })
        .then((res) => {
          this.preStudents = res.data
          // console.log(students)
          // const { data } = res
          // console.log()
        })
    },
    handleAccept(index) {
      const student = this.preStudents[index]
      post('confirm', {
        studentId: student.id,
        tutorId: localStorage.getItem('id'),
        tutorName: localStorage.getItem('name')
      }).then(res => {
        this.$message.success(`您已选择指导${student.name}同学`)
      }).catch(err => {
        this.$message.error(err.response.data)
      })
    },
    handleRefuse(index) {
      this.$confirm(`确定拒绝${this.preStudents[index].name}的选择吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const student = this.preStudents[index]
        post('refuse', {
          studentId: student.id,
          tutorId: localStorage.getItem('id')
        }).then(() => {
          this.$message.warning(`您已拒绝指导${student.name}同学`)
        }).catch(err => {
          this.$message.error(err.response.data)
        })
      })
      // this.$confirm(`确定选择${this.tutors[index].name}作为你的导师吗`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   const tutor = this.tutors[index]
      //   post('select', {
      //     studentId: localStorage.getItem('id'),
      //     tutorId: tutor.id
      //   }).then(res => {
      //     console.log(res)
      //     this.$message.success(res.data)
      //     this.$forceUpdate()
      //   }).catch(err => {
      //     this.$message.error(err.response.data)
      //   })
      // })
    }
  },
}
</script>

<style scoped>
.text-button-danger {
  color: #f56c6c
}

.text-button-danger:hover,
.text-button-danger:focus {
  color: #ec5151
}
</style>