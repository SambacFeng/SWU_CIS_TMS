<!-- <template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10"
                    @click="delAllSelection">批量删除</el-button>
                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="用户名"></el-table-column>
                <el-table-column label="账户余额">
                    <template slot-scope="scope">￥{{ scope.row.money }}</template>
                </el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.thumb"
                            :preview-src-list="[scope.row.thumb]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.state === '成功' ? 'success' : (scope.row.state === '失败' ? 'danger' : '')">{{
                            scope.row.state }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
            <el-button type="primary" icon="el-icon-download" @click="downloadFile">下载文件</el-button>
            <el-upload action="http://localhost:3001/api/upload" accept=".xls,.xlsx" :on-success="handleSuccess"
                :on-error="handleError" :before-upload="beforeUpload" ref="upload">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div>
            </el-upload>
        </div> -->

        <!-- 编辑弹出框 -->
        <!-- <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { fetchData, getFile } from '../../api/index'
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        }
    },
    created() {
        this.getData()
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
        handleSuccess(response, file, fileList) {
            this.$message.success('上传成功')
        },
        handleError(error, file, fileList) {
            this.$message.error('上传失败')
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData(this.query).then(res => {
                console.log('fetch', res)
                this.tableData = res.list
                this.pageTotal = res.pageTotal || 50
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1)
            this.getData()
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功')
                    this.tableData.splice(index, 1)
                })
                .catch(() => { })
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        delAllSelection() {
            const length = this.multipleSelection.length
            let str = ''
            this.delList = this.delList.concat(this.multipleSelection)
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' '
            }
            this.$message.error(`删除了${str}`)
            this.multipleSelection = []
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index
            this.form = row
            this.editVisible = true
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false
            this.$message.success(`修改第 ${this.idx + 1} 行成功`)
            this.$set(this.tableData, this.idx, this.form)
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val)
            this.getData()
        }
    }
}
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
 -->


<template>
  <div class="container">
    <div>
      <!--             <el-form :inline="true">
        <el-form-item>
            <el-select v-model="searchColumn" placeholder="选择搜索列">
                <el-option label="姓名" value="name"></el-option>
                <el-option label="学号" value="id"></el-option>
                <el-option label="专业" value="major"></el-option>
                <el-option label="导师" value="tutor"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-input v-model="searchText" placeholder="输入搜索内容"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleClear">清空</el-button>
        </el-form-item>
    </el-form> -->
      <el-table :data="students" height="715" style="width: 100%" highlight-current-row
        :default-sort="{ prop: 'id', order: 'ascending' }">
        <el-table-column prop="name" label="姓名" min-width="120" sortable></el-table-column>
        <el-table-column prop="id" label="学号" min-width="140" sortable></el-table-column>
        <el-table-column prop="grade" label="年级" min-width="80" :filter-method="filterByGrade" :filters="gradeFilters" sortable>
          <template slot-scope="{ row }">{{ row.grade }}</template>
        </el-table-column>
        <el-table-column prop="major" label="专业" min-width="140" :filter-method="filterByMajor" :filters="majorFilters" sortable>
          <template slot-scope="{ row }">{{ row.major }}</template>
        </el-table-column>
        <el-table-column prop="tutor" label="导师" min-width="80" :filter-method="filterByTutor" :filters="tutorFilters" sortable>
          <template slot-scope="{ row }">{{ row.tutor }}</template>
        </el-table-column>
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
import { getFile, post } from '../../api'
export default {
  data() {
    return {
      students: [],
      majorFilters: [],
      tutorFilters: [],
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
        this.tutorFilters = this.getUniqueFilters(students, 'tutor')
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
      this.$http
        .get("http://localhost:3001/api/studentsInfo")
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
    filterByTutor(value, row) {
      return !value || row.tutor.toLowerCase().includes(value.toLowerCase())
    },
    getUniqueFilters(data, key) {
      const set = new Set()
      data.forEach(item => set.add(item[key]))
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