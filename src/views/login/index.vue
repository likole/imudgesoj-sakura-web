<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">欢迎使用 IMUDGES OJ</h3>
      </div>

      <div id="loginForm">
        <el-form-item v-if="loginType==='username'||loginType==='forget'||loginType==='register'" prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item v-if="loginType==='phone'||loginType==='forget'||loginType==='register'" prop="phone">
          <span class="svg-container">
            <svg-icon icon-class="mobile" />
          </span>
          <el-input
            ref="phone"
            v-model="loginForm.phone"
            placeholder="手机号"
            name="phone"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-if="loginType==='username'||loginType==='phone'" v-model="capsTooltip" content="大写锁定已开启" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-form-item v-if="loginType==='forget'" prop="vcode">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            ref="phone"
            v-model="loginForm.vcode"
            placeholder="验证码"
            name="vcode"
            type="text"
            tabindex="1"
            style="width: 150px"
          />
          <el-button style="float: right;height: 29px;margin: 9px 2px" :disabled="leftTime>0" size="mini" @click="handleSendVcode">获取验证码<span v-if="leftTime>0">({{ leftTime }}S)</span></el-button>
        </el-form-item>

        <el-form-item v-if="loginType==='register'" prop="nickname">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="nickname"
            v-model="loginForm.nickname"
            placeholder="昵称"
            name="nickname"
            type="text"
            tabindex="1"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item v-if="loginType==='forget'||loginType==='register'" prop="newPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            ref="newPassword"
            v-model="loginForm.newPassword"
            type="text"
            placeholder="设置密码"
            name="newPassword"
            tabindex="2"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="loginType==='forget'">重置密码</span>
          <span v-else-if="loginType==='register'">注册</span>
          <span v-else>登录</span>
        </el-button>
      </div>

      <div style="color: gray">
        <span v-if="loginType!=='forget'">
          <el-link @click="loginType='forget'">忘记密码</el-link> |
        </span>
        <span v-if="loginType!=='username'">
          <el-link @click="loginType='username'">用户名登录</el-link> |
        </span>
        <span v-if="loginType!=='phone'">
          <el-link @click="loginType='phone'">手机号登录</el-link> |
        </span>
        <span v-if="loginType!=='register'">
          <el-link @click="loginType='register'">注册</el-link> |
        </span>
        <span id="public-about">
          <el-link href="#/public-about">关于</el-link>
        </span>
      </div>
    </el-form>

    <div id="copyright" style="position: fixed;bottom: 20px;width: 100%">
      <div style="margin: 0 auto;width: 520px;max-width: 100%;text-align: center;color: white;font-size: 12px">
        <p>COPYRIGHT © 2020 <a href="https://www.likole.com" target="_blank">Likole</a>. ALL RIGHTS RESERVED.</p>
        <p>GPLv2 licensed by <a href="https://github.com/zhblue/hustoj">HUSTOJ</a> 2020</p>
        <a href="http://www.beian.miit.gov.cn/" target="_blank" rel="nofollow" style="">浙ICP备18040075号-3</a>
      </div>
    </div>

  </div>
</template>

<script>

import { sendVerifyCode, resetPassword, registerUser } from '../../api/user'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        phone: '',
        vcode: '',
        newPassword: '',
        nickname: ''
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      loginType: 'username',
      leftTime: 0
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.checkLeftTime()
    // if (this.loginForm.username === '') {
    //   this.$refs.username.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
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
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.loginType === 'username') {
            // login by username
            this.loading = true
            this.$store.dispatch('user/login', { username: this.loginForm.username, password: this.loginForm.password })
              .then(() => {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else if (this.loginType === 'phone') {
            // login by phone
            this.loading = true
            this.$store.dispatch('user/loginByPhone', { phone: this.loginForm.phone, password: this.loginForm.password })
              .then(() => {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else if (this.loginType === 'forget') {
            // reset password
            if (this.loginForm.vcode === '') {
              this.$message({ type: 'error', message: '验证码不能为空' })
              return
            }
            this.loading = true
            resetPassword(this.loginForm.username, this.loginForm.phone, this.loginForm.vcode, this.loginForm.newPassword).then(() => {
              this.$message({ type: 'success', message: '密码重置成功，请登录' })
              this.loginType = 'phone'
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else if (this.loginType === 'register') {
            this.loading = true
            registerUser(this.loginForm).then(() => {
              this.$message({ type: 'success', message: '注册成功，请登录' })
              this.loginType = 'phone'
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSendVcode() {
      sendVerifyCode(this.loginForm.username, this.loginForm.phone).then(response => {
        this.$message({ type: 'success', message: '验证码已发送，五分钟内有效' })
        this.leftTime = 60
      })
    },
    checkLeftTime() {
      if (this.leftTime > 1) {
        this.leftTime -= 1
      } else {
        this.leftTime = 0
      }
      setTimeout(this.checkLeftTime, 1000)
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .el-link {
      color: white;
    }

    .el-link:hover {
      color: deepskyblue;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
      #copyright{
        display: none;
      }
      /*#public-about{*/
      /*  display: none;*/
      /*}*/
    }
  }
</style>
