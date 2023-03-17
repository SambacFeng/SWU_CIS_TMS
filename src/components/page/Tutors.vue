<template>
  <div class="container">
    <div>
      <el-table :data="tutors" height="715" highlight-current-row
        :default-sort="{ prop: 'id', order: 'ascending' }">
        <el-table-column prop="name" label="姓名" min-width="80" sortable fixed></el-table-column>
        <el-table-column prop="id" label="教工号" min-width="90" sortable></el-table-column>
        <el-table-column prop="grade" label="年级" min-width="80" :filter-method="filterByGrade" :filters="gradeFilters"
          sortable>
          <template slot-scope="{ row }">{{ row.grade }}</template>
        </el-table-column>
        <el-table-column prop="major" label="专业" min-width="180" :filter-method="filterByMajor" :filters="majorFilters"
          sortable>
          <template slot-scope="{ row }">{{ String(row.major) }}</template>
        </el-table-column>
        <el-table-column prop="rating" label="学生评价" min-width="95" sortable>
          <template slot-scope="{ row }">{{ row.rating || '暂无评价' }}</template>
        </el-table-column>
        <el-table-column prop="recordCount" label="指导次数" min-width="95" sortable></el-table-column>
        <el-table-column label="操作" min-width="90">
          <template slot-scope="scope">
            <el-button class="text-button-danger" size="mini" type="text" @click="handleDelete(scope)">删除</el-button>
            <el-button size="mini" type="text" @click="handleReset(scope)">重置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="button-group">
        <el-upload class="flex-button upload-button" action="http://localhost:3001/api/upload" accept=".xls,.xlsx"
          :on-success="handleUploadSuccess" :on-error="handleUploadError" :before-upload="beforeUpload" ref="upload">
          <el-button type="primary" icon="el-icon-upload2">批量导入</el-button>
        </el-upload>
        <el-button class="flex-button" type="primary" icon="el-icon-download" @click="downloadFile">下载模板</el-button>
        <el-button class="flex-button" type="info" icon="el-icon-refresh" @click="getTutorsInfo">刷新数据</el-button>
      </div>
      <div slot="tip" class="el-upload__tip">请先下载模板再进行导入，文件大小不超过500kb</div>
    </div>
  </div>
</template>

<script>
import { getFile, post, get } from '../../api'
export default {
  data() {
    return {
      tutors: [],
      majorFilters: [],
      gradeFilters: []
    }
  },
  created() {
    this.getTutorsInfo()
  },
  watch: {
    tutors: {
      handler(tutors) {
        this.gradeFilters = this.getUniqueFilters(tutors, 'grade')
        this.majorFilters = this.getUniqueFilters(tutors, 'major')
      },
      immediate: true // 立即触发，确保在组件挂载后初始化 filters
    }
  },
  methods: {
    downloadFile() {
      getFile('tutor.xlsx')
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
      this.getTutorsInfo()
      this.$message.success('数据导入成功')
    },
    handleUploadError() {
      this.$message.error('数据导入失败，请刷新页面后重试，若问题依旧，请与开发者联系')
    },
    getTutorsInfo() {
      get("TutorsInfo")
        .then((res) => {
          const { data } = res
          const tutors = data.map(tutor => {
            if (tutor.evaluation.length > 0) {
              console.log(tutor.evaluation)
              tutor.rating = (tutor.evaluation.reduce((acc, curr) => {
                // console.log(acc, curr)
                return acc + curr.rating
              }, 0) / tutor.evaluation.length).toFixed(1)
            } else {
              tutor.rating = 0
            }
            return tutor
          })
          this.tutors = tutors
          console.log(this.tutors)
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
        post('deleteUser', { id: row.id, type: '2' }).then(res => {
          this.$message.success(`${row.name}已删除`)
          this.getTutorsInfo()
        }).catch(err => {
          this.$message.error(err.response.data)
        })
      })
    },
    handleReset(scope) {
      const { row, $index } = scope
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
      return !value || row.major.includes(value.toLowerCase())
    },
    getUniqueFilters(data, key) {
      const set = new Set()
      data.forEach(item => {
        if (Array.isArray(item[key])) {
          item[key].forEach(subItem => {
            set.add(subItem)
          })
        } else {
          set.add(item[key])
        }
      })
      return Array.from(set).map(value => ({ text: value, value }))
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