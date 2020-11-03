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
      <el-alert v-if="!user.email1Verified && verifying1" :closable="false" type="success" style="margin-bottom: 20px">
        验证邮件已发送，请前往邮箱 {{ user.email1 }} 查看，如果长时间未收到邮件，请检查垃圾箱或重新发送~
      </el-alert>
      <el-form-item label="邮箱1" prop="email1">
        <el-input v-model="user.email1" type="email">
          <div slot="append">
            <span v-if="user.email1Verified" style="color: green">
              √ 已验证
            </span>
            <div v-else-if="verifying1===true">
              <el-button type="primary" @click="$emit('reload')">点击此处刷新状态</el-button>
            </div>
            <el-button v-else @click="handleSendVerifyEmail(1)">
              点击此处验证邮箱
            </el-button>
          </div>
        </el-input>
      </el-form-item>
      <el-alert v-if="!user.email2Verified && verifying2" :closable="false" type="success" style="margin-bottom: 20px">
        验证邮件已发送，请前往邮箱 {{ user.email2 }} 查看，如果长时间未收到邮件，请检查垃圾箱或重新发送~
      </el-alert>
      <el-form-item label="邮箱2" prop="email2">
        <el-input v-model="user.email2" type="email">
          <div slot="append">
            <span v-if="user.email2Verified" style="color: green">
              √ 已验证
            </span>
            <div v-else-if="verifying2===true">
              <el-button type="primary" @click="$emit('reload')">点击此处刷新状态</el-button>
            </div>
            <el-button v-else @click="handleSendVerifyEmail(2)">
              点击此处验证邮箱
            </el-button>
          </div>
        </el-input>
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
import { updateContactInfo, verifyEmail } from '../../../api/user'

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
        const reg = /^1(3([0-35-9]\d|4[1-8])|4[14-9]\d|5([0125689]\d|7[1-79])|66\d|7[2-35-8]\d|8\d{2}|9[13589]\d)\d{7}$/
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
      },
      verifying1: false,
      verifying2: false
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
    },
    handleSendVerifyEmail(type) {
      this.$emit('loading')
      verifyEmail(type).then(response => {
        if (type === 1) {
          this.verifying1 = true
        } else {
          this.verifying2 = true
        }
        this.$emit('finish')
      }).catch(() => {
        this.$emit('finish')
      })
    }
  }
}
</script>
