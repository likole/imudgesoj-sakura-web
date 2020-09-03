<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card v-if="user.username!==undefined" :user="user" :me="true" :id-for-update="idForUpdate" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card v-loading="loading">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本信息" name="basicInfo">
                <basic-info :user="user" @loading="handleLoading" @finish="handleFinish" @reload="handleReload" />
              </el-tab-pane>
              <el-tab-pane label="联系信息" name="contactInfo">
                <contact-info :user="user" @loading="handleLoading" @finish="handleFinish" @reload="handleReload" />
              </el-tab-pane>
              <el-tab-pane label="账号信息" name="accountInfo">

                <div v-if="accountInfoStatus===0">
                  <el-button type="success" @click="accountInfoSwitchToChangePhone">更改手机号</el-button>
                  <el-button type="primary" @click="accountInfoSwitchToChangeNickname">更改昵称</el-button>
                  <el-button type="warning" @click="accountInfoStatus=3">更改密码</el-button>
                </div>
                <div v-else>
                  <el-button type="text" style="margin-bottom: 20px" @click="accountInfoStatus=0">&lt;&lt; 返回</el-button>
                </div>

                <div v-if="accountInfoStatus===1">
                  <el-form>
                    <el-form-item>
                      <el-input v-model="phone" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleChangePhone()">修改</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div v-else-if="accountInfoStatus===2">
                  <el-form>
                    <el-form-item>
                      <el-input v-model="nickname" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleChangeNickname()">修改</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div v-else-if="accountInfoStatus===3">
                  <password />
                </div>

              </el-tab-pane>
              <el-tab-pane label="登录历史" name="loginLog">
                <login-log />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Password from './components/Password'
import BasicInfo from './components/BasicInfo'
import ContactInfo from './components/ContantInfo'
import LoginLog from '@/views/profile/components/LoginLog'
import { fetchUserInfo, getSelfPhone, getSelfNickname, changePhone, changeNickname } from '../../api/user'

export default {
  name: 'Profile',
  components: { UserCard, Password, BasicInfo, ContactInfo, LoginLog },
  data() {
    return {
      user: {},
      activeTab: 'basicInfo',
      loading: false,
      accountInfoStatus: 0,
      phone: undefined,
      nickname: undefined,
      idForUpdate: 1
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      fetchUserInfo().then(response => {
        this.user = response.data
        this.user.username = this.name
        this.user.role = this.roles.join(' | ')
        this.user.avatar = this.avatar
      })
    },
    handleLoading() {
      this.loading = true
    },
    handleFinish() {
      this.loading = false
    },
    handleReload() {
      this.loading = true
      fetchUserInfo().then(response => {
        this.user = response.data
        this.user.username = this.name
        this.user.role = this.roles.join(' | ')
        this.user.avatar = this.avatar
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    accountInfoSwitchToChangePhone() {
      if (this.phone === undefined) {
        getSelfPhone().then(response => {
          this.phone = response.data
        })
      }
      this.accountInfoStatus = 1
    },
    accountInfoSwitchToChangeNickname() {
      if (this.nickname === undefined) {
        getSelfNickname().then(response => {
          this.nickname = response.data
        })
      }
      this.accountInfoStatus = 2
    },
    handleChangePhone() {
      this.loading = true
      changePhone(this.phone).then(() => {
        this.$notify({
          title: '修改成功',
          message: '手机号已修改成功',
          type: 'success',
          duration: 2000
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleChangeNickname() {
      this.loading = true
      changeNickname(this.nickname).then(() => {
        this.$notify({
          title: '修改成功',
          message: '昵称已修改成功',
          type: 'success',
          duration: 2000
        })
        this.idForUpdate++
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
