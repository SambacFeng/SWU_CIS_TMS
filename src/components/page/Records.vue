<template>
  <div class="container">
    <el-table :data="records" style="width: 100%" :default-sort="{ prop: 'date', order: 'ascending' }">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item class="long-label" style="width: 30%;" label="导师">
              <span>{{ props.row.tutorName }}</span>
            </el-form-item>
            <el-form-item class="short-label" style="width: 30%;" label="时间">
              <span>{{ props.row.date }}</span>
            </el-form-item>
            <el-form-item class="short-label" style="width: 40%;" label="地点">
              <span style="display: inline; word-break: inherit;">{{ props.row.location }}</span>
            </el-form-item>
            <el-form-item class="long-label" label="学生">
              <span>{{ props.row.studentsName.join('、') }}</span>
            </el-form-item>
            <el-form-item class="long-label" label="主要内容">
              <span>{{ props.row.content }}</span>
            </el-form-item>
            <el-form-item class="long-label" label="问题解决">
              <span>{{ props.row.problem }}</span>
            </el-form-item>
            <el-form-item class="long-label" label="情况说明">
              <span>{{ props.row.notation }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="导师" sortable prop="tutorName" :filter-method="filterByTutorName" :filters="tutorNameFilters">
      </el-table-column>
      <el-table-column label="时间" sortable prop="date">
      </el-table-column>
      <el-table-column label="地点" prop="location">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { get } from '../../api'
export default {
  data() {
    return {
      records: [],
      tutorNameFilters: []
    }
  },
  created() {
    this.getRecordsInfo()
  },
  watch: {
    records: {
      handler(records) {
        this.tutorNameFilters = this.getUniqueFilters(records, 'tutorName')
      },
      immediate: true // 立即触发，确保在组件挂载后初始化 filters
    }
  },
  methods: {
    getRecordsInfo() {
      get('recordsInfo')
        .then(res => {
          this.records = res.data
          console.log(this.records)
        })
        .catch(err => {
          console.log(err)
        })
    },
    filterByTutorName(value, row) {
      return !value || row.tutorName.toLowerCase().includes(value.toLowerCase())
    },
    getUniqueFilters(data, key) {
      const set = new Set()
      data.forEach(item => set.add(item[key]))
      return Array.from(set).map(value => ({ text: value, value }))
    },
  }
}
</script>

<style>
.table-expand {
  font-size: 0;
}

.table-expand .short-label label {
  width: 40px;
  color: #99a9bf;
}

.table-expand .long-label label {
  width: 80px;
  color: #99a9bf;
}

.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}

.table-expand .el-form-item span {
  display: block;
  word-break: break-word;
}
</style>