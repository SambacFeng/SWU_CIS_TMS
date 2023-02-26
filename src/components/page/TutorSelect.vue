<template>
  <div class="container">
    <div>
      <el-table :data="tutors" style="width: 100%" highlight-current-row
        :default-sort="{ prop: 'id', order: 'ascending' }">
        <el-table-column prop="name" label="姓名" min-width="80" sortable></el-table-column>
        <el-table-column prop="selected" label="学生人数" min-width="100" sortable></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="160"></el-table-column>
        <el-table-column prop="phone" label="联系电话" min-width="100"></el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleOpenLink(scope.$index)">查看介绍</el-button>
            <el-button size="mini" type="text" @click="handleSelect(scope.$index)"
              :disabled="!scope.row.available || studentAvailable">选择</el-button>
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
      id: localStorage.getItem('id'),
      type: localStorage.getItem('role'),
      tutors: []
    }
  },
  created() {
    this.getUserInfo()
    this.getTutorsInfo()
  },
  computed: {
    studentAvailable() {
      return Boolean(this.userInfo.tutor) || Boolean(this.userInfo.preTutor)
    }
  },
  methods: {
    getUserInfo() {
      get('info', { type: this.type, id: this.id }).then(res => {
        console.log(res)
        this.userInfo = res.data
      })
    },
    getTutorsInfo() {
      get('TutorsInfo')
        .then((res) => {
          const { data } = res
          console.log(data)
          this.tutors = data.filter(tutor => {
            tutor.totalStudents = tutor.students.length + tutor.preStudents.length
            tutor.selected = tutor.totalStudents + ' / 15'
            tutor.available = tutor.totalStudents < 15
            return tutor.grade == localStorage.getItem('grade')
              && tutor.major.includes(localStorage.getItem('major'))
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleOpenLink(index) {
      window.open(this.tutors[index].link, '_blank')
    },
    handleSelect(index) {
      this.$confirm(`确定选择${this.tutors[index].name}作为你的导师吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tutor = this.tutors[index]
        post('select', {
          studentId: localStorage.getItem('id'),
          tutorId: tutor.id
        }).then(res => {
          console.log(res)
          this.$message.success(res.data)
          this.$forceUpdate()
        }).catch(err => {
          this.$message.error(err.response.data)
        })
      })
    }
  },
}
</script>

<style scoped></style>