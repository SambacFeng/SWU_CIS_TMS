<template>
  <div class="container">
    <h1>{{ userInfo.name || '管理员' }}{{ type == '1' ? '同学' : '老师' }}，{{ greeting }}</h1>
    <el-divider></el-divider>
    <!-- 管理员 -->
    <template v-if="type === '0'">
      <span style="height: 30px">您可以：</span>
      <el-row>
        <el-col :span="24">
          <el-row v-for="link in adminLinks" :key="link.id">
            <el-col :span="24">
              <el-link class="text-link" type="primary" @click="goToAnotherPage(link.url)">{{ link.text }}</el-link>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </template>
    <!-- 学生 -->
    <template v-if="type === '1'">
      <div v-if="userInfo.tutor" style="height: 30px;">
        您的导师是{{ userInfo.tutor }}
      </div>
      <div v-else-if="userInfo.preTutor">
        您已选择了{{ userInfo.preTutor }}老师，等待老师确认
      </div>
      <div v-else>
        <span>
          您还未选择导师，去
          <el-link class="inline-link" type="primary" @click="goToAnotherPage()">选择导师</el-link>
        </span>
      </div>
    </template>
    <!-- 导师 -->
    <template v-if="type === '2'"></template>
  </div>
</template>

<script>
import { get } from '../../api'
export default {
  data() {
    return {
      userInfo: {},
      greeting: '',
      id: localStorage.getItem('id'),
      type: localStorage.getItem('role'),
      adminLinks: [
        {
          id: 1,
          url: '/students',
          text: '管理学生信息'
        },
        {
          id: 2,
          url: '/tutors',
          text: '管理导师信息'
        }
      ]
    }
  },
  created() {
    get('info', { type: this.type, id: this.id }).then(res => {
      console.log(res)
      this.userInfo = res.data
    })
  },
  mounted() {
    const currentTime = new Date().getHours()
    if (currentTime >= 0 && currentTime < 3) {
      this.greeting = '晚上好，夜深了，早点休息'
    } else if (currentTime >= 3 && currentTime < 12) {
      this.greeting = '早上好'
    } else if (currentTime >= 12 && currentTime < 18) {
      this.greeting = '下午好'
    } else {
      this.greeting = '晚上好'
    }
  },
  methods: {
    goToAnotherPage(url) {
      console.log(url)
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>
.text-link {
  height: 25px;
}

.inline-link {
  font-size: 16px;
  vertical-align: baseline;
}
</style>