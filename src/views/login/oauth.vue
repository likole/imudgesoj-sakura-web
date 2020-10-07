<template>
  <div>
    <h2 style="text-align: center">{{ error }}</h2>
    <el-card v-if="application.clientId" class="box-card" style="width: 70%;margin: 0 auto">
      <div slot="header" class="clearfix">
        登录授权
      </div>
      <p>您即将使用您的OJ账号登录
        <el-popover
          placement="right"
          title="应用介绍"
          width="200"
          trigger="hover"
          :content="application.description"
        >
          <span slot="reference" style="color: royalblue;font-weight: bold">
            {{ application.name }}
          </span>
        </el-popover>
      </p>
      <div>
        该应用将会获得以下权限：
        <ul>
          <li v-for="scope in application.scopes">
            {{ scope }}
          </li>
        </ul>
      </div>
      <el-button type="primary" @click="redirect">确认授权</el-button>
    </el-card>
  </div>
</template>
<script>
import { getApplicationInfo, nonceLogin } from '@/api/oauth'

export default {
  name: 'Oauth',
  data() {
    return {
      query: {},
      error: '',
      application: {}
    }
  },
  created() {
    this.query = this.$route.query
    if (!this.query.client_id) {
      this.error += 'client_id不能为空 '
      return
    }
    if (!this.query.response_type) {
      this.error += 'response_type不能为空'
      return
    }
    if (!this.query.state) {
      this.error += 'state不能为空'
      return
    }
    getApplicationInfo(this.query.client_id).then(response => {
      this.application = response.data
    })
  },
  methods: {
    redirect() {
      nonceLogin().then(response => {
        window.location.href = process.env.VUE_APP_BASE_API_NEW + `/oauth/authorize?login_nonce=${response.data}&client_id=${this.query.client_id}&response_type=${this.query.response_type}&state=${this.query.state}`
      })
    }
  }
}
</script>
