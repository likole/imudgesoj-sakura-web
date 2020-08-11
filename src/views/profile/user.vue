<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="12" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="12" :xs="24">
          <el-card>
            开发中。。。
            <!--            <el-tabs v-model="activeTab">-->
            <!--              <el-tab-pane label="Activity" name="activity">-->
            <!--                <activity />-->
            <!--              </el-tab-pane>-->
            <!--              <el-tab-pane label="Timeline" name="timeline">-->
            <!--                <timeline />-->
            <!--              </el-tab-pane>-->
            <!--              <el-tab-pane label="Account" name="account">-->
            <!--                <account :user="user" />-->
            <!--              </el-tab-pane>-->
            <!--            </el-tabs>-->
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard'

export default {
  name: 'ProfileUser',
  components: { UserCard },
  data() {
    return {
      user: {},
      activeTab: 'activity',
      tempRoute: {}
    }
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
