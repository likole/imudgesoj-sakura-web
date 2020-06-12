<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" :me="true" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
<!--              <el-tab-pane label="个人信息" name="info">-->
<!--                <info />-->
<!--              </el-tab-pane>-->
              <el-tab-pane label="修改密码" name="password">
                <password />
              </el-tab-pane>
              <!--              <el-tab-pane label="Account" name="account">-->
              <!--                <account :user="user" />-->
              <!--              </el-tab-pane>-->
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
// import Activity from './components/Activity'
// import Timeline from './components/Timeline'
// import Account from './components/Account'
import Info from './components/Info'
import Password from './components/Password'

export default {
  name: 'Profile',
  components: { UserCard, Info, Password },
  data() {
    return {
      user: {},
      activeTab: 'password'
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
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  }
}
</script>
