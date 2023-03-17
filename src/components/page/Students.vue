<template>
  <div class="container">
    <div>
      <el-table :data="students" height="715" style="width: 100%" highlight-current-row
        :default-sort="{ prop: 'id', order: 'ascending' }">
        <el-table-column prop="name" label="姓名" min-width="120" sortable></el-table-column>
        <el-table-column prop="id" label="学号" min-width="140" sortable></el-table-column>
        <el-table-column prop="grade" label="年级" min-width="80" :filter-method="filterByGrade" :filters="gradeFilters"
          sortable>
          <template slot-scope="{ row }">{{ row.grade }}</template>
        </el-table-column>
        <el-table-column prop="major" label="专业" min-width="140" :filter-method="filterByMajor" :filters="majorFilters"
          sortable>
          <template slot-scope="{ row }">{{ row.major }}</template>
        </el-table-column>
        <el-table-column prop="tutorName" label="导师" min-width="80" :filter-method="filterByTutorName"
          :filters="tutorNameFilters" sortable>
          <template slot-scope="{ row }">{{ row.tutorName || row.tutor || '未选择' }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="90">
          <template slot-scope="scope">
            <el-button class="text-button-danger" type="text" @click="handleDelete(scope)">删除</el-button>
            <el-button type="text" @click="handleReset(scope)">重置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="button-group">
        <el-upload class="flex-button upload-button" action="http://localhost:3001/api/upload" accept=".xls,.xlsx"
          :on-success="handleUploadSuccess" :on-error="handleUploadError" :before-upload="beforeUpload" ref="upload">
          <el-button type="primary" icon="el-icon-upload2">批量导入</el-button>
        </el-upload>
        <el-button class="flex-button" type="primary" icon="el-icon-download" @click="downloadFile">下载模板</el-button>
        <el-button class="flex-button" type="primary" icon="el-icon-plus" @click="showForm = true">新增学生</el-button>
        <el-button class="flex-button" type="info" icon="el-icon-refresh" @click="getStudentsInfo">刷新数据</el-button>
      </div>
      <div slot="tip" class="el-upload__tip">请先下载模板再进行导入，文件大小不超过500kb</div>
    </div>
    <el-dialog title="创建学生" :visible.sync="showForm" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="form.grade"></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="form.major"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showForm = false">取消</el-button>
        <el-button type="primary" @click="createStudent">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFile, post, get } from '../../api'
export default {
  data() {
    return {
      students: [],
      majorFilters: [],
      tutorNameFilters: [],
      gradeFilters: [],
      showForm: false,
      form: {
        name: '',
        id: '',
        grade: '',
        major: ''
      }
    }
  },
  created() {
    this.getStudentsInfo()
  },
  watch: {
    students: {
      handler(students) {
        this.gradeFilters = this.getUniqueFilters(students, 'grade')
        this.majorFilters = this.getUniqueFilters(students, 'major')
        this.tutorNameFilters = [
          ...this.getUniqueFilters(students, 'tutorName'),
          { text: '未选择', value: "" }
        ]
      },
      immediate: true // 立即触发，确保在组件挂载后初始化 filters
    }
  },
  methods: {
    downloadFile() {
      getFile('student.xlsx')
    },
    beforeUpload(file) {
      const isExcel =
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isExcel) {
        this.$message.error('只能上传 xls 或 xlsx 格式的文件')
      }
      return isExcel
    },
    handleUploadSuccess() {
      this.getStudentsInfo()
      this.$message.success('数据导入成功')
    },
    handleUploadError() {
      this.$message.error('数据导入失败，请刷新页面后重试，若问题依旧，请与开发者联系')
    },
    getStudentsInfo() {
      get("studentsInfo")
        .then((res) => {
          console.log(res.data)
          this.students = res.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleDelete(scope) {
      const { row, $index } = scope
      this.$confirm(`确定删除${row.name}吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(scope)
        post('deleteUser', { id: row.id, type: '1' }).then(res => {
          this.$message.success(`${row.name}已删除`)
          this.getStudentsInfo()
        }).catch(err => {
          this.$message.error(err.response.data)
        })
      })
    },
    handleReset(scope) {
      const { row, $index } = scope
      // console.log(row, $index, row.id)
      this.$confirm(`确定重置${row.name}的密码吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        post('resetPassword', { id: row.id }).then(res => {
          this.$message.success(`${row.name}的密码重置成功`)
        }).catch(err => {
          this.$message.error(err.response.data)
        })
      })
    },
    filterByGrade(value, row) {
      return !value || row.grade.toLowerCase().includes(value.toLowerCase())
    },
    filterByMajor(value, row) {
      return !value || row.major.toLowerCase().includes(value.toLowerCase())
    },
    filterByTutorName(value, row) {
      if (value === '') {
        return row.tutorName === ''
      } else {
        return !value || (row.tutorName && row.tutorName.toLowerCase().includes(value.toLowerCase()))
      }
    },
    getUniqueFilters(data, key) {
      const set = new Set()
      data.forEach(item => {
        if (item[key]) {
          set.add(item[key])
        }
      })
      return Array.from(set).map(value => ({ text: value, value }))
    },
    createStudent() {
      this.$message.success('创建成功')
      this.showForm = false
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        id: '',
        grade: '',
        major: ''
      }
    }
  },
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

.button-group {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 20px;
}

.flex-button {
  width: 97px;
}

.upload-button {
  margin-right: 10px;
}

.el-upload-list__item-name {
  margin-right: 20px;
}

.text-button-danger {
  color: #f56c6c
}

.text-button-danger:hover,
.text-button-danger:focus {
  color: #ec5151
}
</style>