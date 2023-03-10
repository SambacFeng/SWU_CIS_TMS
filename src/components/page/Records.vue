<template>
  <div class="container">
    <el-table :data="records" style="width: 100%">
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
            <el-form-item class="long-label" style="width: 100%;" label="学生">
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
      <el-table-column label="导师" prop="tutorName">
      </el-table-column>
      <el-table-column label="时间" prop="date">
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
      tableData: [{
        id: '12987122',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987123',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987125',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987126',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }],
      records: []
    }
  },
  created() {
    this.getRecordsInfo()
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
    }
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