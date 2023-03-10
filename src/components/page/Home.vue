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
        你的导师是{{ tutorName }}老师，你可以
        <el-link class="inline-link" type="primary" @click="openMessageBox()">查看导师联系方式</el-link>
        或
        <el-link class="inline-link" type="primary" @click="openMessageBox()">对导师进行评价</el-link>
      </div>
      <div v-else-if="userInfo.preTutor">
        你已选择了{{ tutorName }}老师，请等待老师确认，若老师长时间未确认，请
        <el-link class="inline-link" type="primary" @click="openMessageBox()">联系导师</el-link>
      </div>
      <div v-else>
        <span>
          您还未选择导师，去
          <el-link class="inline-link" type="primary" @click="goToAnotherPage('/tutorSelect')">选择导师</el-link>
        </span>
      </div>
    </template>
    <!-- 导师 -->
    <template v-if="type === '2'">
      <div v-if="userInfo.preStudents.length > 0">
        您还有未确认的学生，请
        <el-link class="inline-link" type="primary" @click="goToAnotherPage('/tutorConfirm')">点击确认</el-link>
      </div>
      <div>
        您可以：
        <el-link class="inline-link" type="primary" @click="goToAnotherPage('/createRecord')">填写指导记录</el-link>
      </div>
    </template>
  </div>
</template>

<script>
import { get } from '../../api'
export default {
  data() {
    return {
      userInfo: {},
      tutorName: '',
      greeting: '',
      passwordNeedModify: localStorage.getItem('passwordNeedModify') == 'true',
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
        },
        {
          id: 3,
          url: '/records',
          text: '查看指导记录'
        }
      ]
    }
  },
  created() {
    get('info', { type: this.type, id: this.id }).then(res => {
      console.log(res)
      this.userInfo = res.data
      localStorage.setItem('name', this.userInfo.name)
      localStorage.setItem('grade', this.userInfo.grade)
      localStorage.setItem('major', this.userInfo.major)
      if (this.type === '1') {
        get('info', { type: '2', id: this.userInfo.preTutor || this.userInfo.tutor })
          .then(res => {
            this.userInfo.tutorInfo = res.data
            this.tutorName = this.userInfo.tutorInfo.name
            console.log(this.userInfo.tutorInfo)
          })
      } else {
        localStorage.setItem('students', this.userInfo.students)
      }
    })
    if (this.passwordNeedModify) {
      this.goToModifyPassWord()
    }
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
    },
    openMessageBox() {
      this.$alert(
        `<div>${this.userInfo.tutorInfo.name}老师：</div>
        <div>电话：${this.userInfo.tutorInfo.phone}</div>
        <div>邮箱：${this.userInfo.tutorInfo.email}</div>`
        , '联系方式', {
        dangerouslyUseHTMLString: true
      })
    },
    goToModifyPassWord() {
      this.$confirm('您首次登录系统或未修改初始密码，是否前往修改密码', '警告', {
        confirmButtonText: '前往修改',
        cancelButtonText: '下次再说',
        type: 'warning'
      }).then(() => {
        this.$router.push('/modify')
      }).catch(() => {
        this.$message.warning('建议您尽快修改密码')
      })
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

.el-message-box__container {
  white-space: pre-wrap;
}
</style>