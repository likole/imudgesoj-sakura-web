<template>
  <div>
    <el-alert type="info" style="margin-bottom: 20px">
      该页面的手机、邮箱不作为登录使用。如需修改登录手机号，请在<b>账号信息</b>中修改。
    </el-alert>
    <el-form ref="form" :model="user" :rules="rules" label-width="80px" label-position="left">
      <el-form-item label="手机1" prop="phone1">
        <el-input v-model="user.phone1" />
      </el-form-item>
      <el-form-item label="手机2" prop="phone2">
        <el-input v-model="user.phone2" />
      </el-form-item>
      <el-form-item label="邮箱1" prop="email1">
        <el-input v-model="user.email1" type="email" />
      </el-form-item>
      <el-form-item label="邮箱2" prop="email2">
        <el-input v-model="user.email2" type="email" />
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-input v-model="user.qq" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpdate">更新</el-button>
        <el-button type="primary" @click="$refs.form.resetFields();$emit('reload')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateContactInfo } from '../../../api/user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        const reg = /^1[3|7|8]\d{9}$|^19[8-9]\d{8}$|^166\d{8}|^15[0-3|5-9]\d{8}|^14[5|7]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      rules: {
        phone1: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        phone2: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        email1: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        email2: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        qq: [

        ]
      }
    }
  },
  methods: {
    handleUpdate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('loading')
          if (this.user.phone1 === '') {
            this.user.phone1 = undefined
          }
          if (this.user.phone2 === '') {
            this.user.phone2 = undefined
          }
          if (this.user.email1 === '') {
            this.user.email1 = undefined
          }
          if (this.user.email2 === '') {
            this.user.email2 = undefined
          }
          if (this.user.qq === '') {
            this.user.qq = undefined
          }
          updateContactInfo(this.user).then(() => {
            this.$notify({
              title: '更新成功',
              message: '用户信息更新成功',
              type: 'success',
              duration: 2000
            })
            this.$refs.form.resetFields()
            this.$emit('reload')
          }).catch(() => {
            this.$emit('finish')
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
