<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" :me="true" />
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
              <el-tab-pane label="修改密码" name="password">
                <password />
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
import { fetchUserInfo } from '../../api/user'

export default {
  name: 'Profile',
  components: { UserCard, Password, BasicInfo, ContactInfo },
  data() {
    return {
      user: {},
      activeTab: 'basicInfo',
      loading: false
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
        this.email = 'admin@test.com'
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
        this.email = 'admin@test.com'
        this.user.avatar = this.avatar
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
