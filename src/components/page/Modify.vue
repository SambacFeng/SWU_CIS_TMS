<template>
    <div class="change-password">
        <h2>修改密码</h2>
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" style="max-width: 400px;">
            <el-form-item label="原密码" prop="oldPassword">
                <el-input type="password" v-model="form.oldPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="form.newPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="form.confirmPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
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
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            rules: {
                oldPassword: [
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.form.newPassword) {
                                callback(new Error('两次输入密码不一致'))
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 发送请求修改密码
                    post('modifyPassword', this.form).then(res => {
                        this.$message.success(res.data)
                        localStorage.clear()
                        this.$router.push('/login')
                    }).catch(err => {
                        // console.log(err.response.data)
                        this.$message.error(err.response.data)
                    })
                    // 如果修改成功，可以跳转到登录页
                } else {
                    return false
                }
            })
        },
        resetForm() {
            this.$refs.form.resetFields()
        }
    }
}
</script>

<style scoped>
h2 {
    margin-bottom: 30px;
}

.change-password {
    margin: 30px;
    padding: 0;
    display: flex;
    height: 100%;
    flex-direction: column;
}
</style>