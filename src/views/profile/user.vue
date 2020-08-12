<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="12" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="12" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="开发中" name="activity">
                开发中
              </el-tab-pane>
              <el-tab-pane v-if="roles.includes('管理员')" label="登录历史" name="loginLog">
                <login-log :me="false" :username="user.username" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import LoginLog from '@/views/profile/components/LoginLog'
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileUser',
  components: { UserCard, LoginLog },
  data() {
    return {
      user: {},
      activeTab: 'activity',
      tempRoute: {}
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route)
    this.user = {
      username: this.$route.params && this.$route.params.id,
      role: ''
    }
    this.setTagsViewTitle()
    this.setPageTitle()
  },
  methods: {
    setTagsViewTitle() {
      const title = '用户信息'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.user.username}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '用户信息'
      document.title = `${title} - ${this.user.username}`
    }
  }
}
</script>
