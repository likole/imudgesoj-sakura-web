<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
    <el-form-item label="原密码" prop="oldPassword">
      <el-input v-model.trim="form.oldPassword" type="password" show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-tooltip v-model="capsTooltip" content="大写锁定已开" placement="left" manual>
        <el-input
          v-model.trim="form.password"
          type="password"
          show-password
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
        />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="确认密码" prop="rePassword">
      <el-input v-model.trim="form.rePassword" type="password" show-password @keyup.enter.native="submit" />
    </el-form-item>
    <el-form-item>
      <el-button v-loading="loading" type="primary" @click="submit">修改</el-button>
      <el-button @click="$refs['form'].resetFields()">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { changePassword } from '../../../api/user'

export default {
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else if (value === this.form.oldPassword) {
        callback(new Error('新密码不能与原密码相同!'))
      } else if (this.checkStrong(value) < 2) {
        callback(new Error('密码至少包含大写字母、小写字母、数字、特殊符号中的两种'))
      } else {
        callback()
      }
    }
    const validateNewPassword2 = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else if (value !== this.form.password) {
        callback(new Error('新密码两次输入不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldPassword: undefined,
        password: undefined,
        rePassword: undefined
      },
      loading: false,
      capsTooltip: false,
      strength: 0,
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请设置新密码', trigger: 'blur' },
          { validator: validateNewPassword, trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateNewPassword2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    checkStrong(sValue) {
      var modes = 0
      if (sValue.length < 6) return modes
      if (/\d/.test(sValue)) modes++
      if (/[a-z]/.test(sValue)) modes++
      if (/[A-Z]/.test(sValue)) modes++
      if (/\W/.test(sValue)) modes++

      switch (modes) {
        case 1:
          return 1
        case 2:
          return 2
        case 3:
        case 4:
          return sValue.length < 10 ? 3 : 4
      }
      return modes
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          changePassword(this.form).then(response => {
            this.$notify({
              title: '修改成功',
              message: '密码已修改成功',
              type: 'success',
              duration: 2000
            })
            this.$refs.form.resetFields()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
