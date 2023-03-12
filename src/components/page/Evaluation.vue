<template>
  <div class="container">
    <el-form :model="form" ref="form" :rules="rules" label-width="120px">
      <el-form-item label="导师评分">
        <el-rate v-model="form.rating" :max="5" :colors="colors" show-score></el-rate>
      </el-form-item>
      <el-form-item label="导师评价" prop="comment">
        <el-input type="textarea" :rows="5" v-model="form.comment"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="submitting" @click="submitForm">
          {{ submitting ? '提交中...' : '提交评价' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { post } from '../../api'
export default {
  data() {
    return {
      form: {
        rating: 5,
        comment: ''
      },
      colors: {
        1: '#99A9BF',
        2: '#F7BA2A',
        3: '#E6A23C',
        4: '#FF9900',
        5: '#F56C6C'
      },
      submitting: false,
      rules: {
        comment: [
          { required: true, message: '请输入导师评价', trigger: 'blur' },
          { min: 10, message: '至少输入十个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 提交表单的逻辑
          this.submitting = true
          console.log(this.form)
          post('evaluation', {
            ...this.form,
            student: localStorage.getItem('id'),
            tutorId: localStorage.getItem('tutor')
          }).then(() => {
            this.$message.success(`发表评价成功`)
            this.submitting = false
            this.form.rating = 5
            this.form.comment = ''
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.$message.error('请完成导师评价后再提交')
        }
      })
    }
  }
}
</script>

<style scoped>
.el-rate {
  line-height: 2;
}
</style>