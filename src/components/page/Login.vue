<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">计信院导师管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="id">
          <el-input v-model="param.id" placeholder="请输入用户名" tabindex="1">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter.native="submitForm()" tabindex="2">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()" tabindex="3">登录</el-button>
        </div>
        <p class="login-tips">Tips : 初始用户名/密码均为学号/教工号<br />忘记密码请联系学院管理员进行重置<br />建议使用新版本Chrome或Firefox以获取更好体验</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { userInfo } from 'os'
import { resolve } from 'path'
import { post } from '../../api/index'
export default {
  data: function () {
    return {
      param: {
        id: '',
        password: '',
      },
      rules: {
        id: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    }
  },
  methods: {
    submitForm() {
      this.$refs.login.validate(valid => {
        if (valid) {
          post('login', this.param).then(res => {
            console.log(res)
            if (res.status == 200) {
              const { user, token, passwordNeedModify } = res.data
              const { id, role } = user
              this.$message.success('登录成功')
              console.log(res.data)
              // [user, id, token].map(item => {
              //     localStorage.setItem(`${item}`, item)
              // })
              localStorage.setItem('token', token)
              localStorage.setItem('id', id)
              localStorage.setItem('role', role)
              localStorage.setItem('passwordNeedModify', passwordNeedModify)
              this.$router.push('/')
            } else {
              this.$message.error('未知错误')
            }
          }).catch(res => {
            this.$message.error('用户名或密码错误')
            console.log('fail', res)
          })
          // this.$message.success('登录成功');
          // localStorage.setItem('ms_id', this.param.id);
          // this.$router.push('/');
        } else {
          this.$message.error('请输入账号和密码')
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px 15px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}

.login-tips {
  text-align: center;
}
</style>

<!-- <template>
    <div class="login-page">
        <el-form ref="loginForm" :model="loginForm" label-width="0" class="login-form">
            <h1 class="login-title">登录</h1>
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入用户名">
                    <template v-slot:prepend>
                        <i class="el-icon-user"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码">
                    <template v-slot:prepend>
                        <i class="el-icon-lock"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item style="width: 100%;">
                <el-button type="primary" @click="handleSubmit" style="width: 100%;">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        handleSubmit() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    // 在这里处理登录逻辑
                }
            })
        }
    }
}
</script>

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.login-form {
    width: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-title {
    text-align: center;
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: bold;
}
</style> -->