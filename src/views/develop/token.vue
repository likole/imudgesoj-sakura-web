<template>
  <div class="app-container">
    <el-alert type="error">token机制已更换，该部分尚未实现</el-alert>
    <h3>手动操作</h3>
    <el-form label-position="left" label-width="50px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="key">
            <el-input v-model="key" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="value">
            <el-input v-model="value" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="success" disabled @click="addSession">添加 / 更新</el-button>
          <el-button type="danger" disabled @click="removeSession">移除</el-button>
        </el-col>
      </el-row>
    </el-form>
    <h3>新令牌</h3>
    <el-input v-if="renew" type="textarea" :value="renew" :rows="7" />
    <p v-else>未更新（手动操作后，不应该看到这几个字）</p>
    <h3>服务器端会话内容</h3>
    <json-editor v-model="session" style="margin-top: 20px" />
  </div>
</template>
<script>
import request from '@/utils/request'
import JsonEditor from '@/components/JsonEditor'
export default {
  name: 'DevelopToken',
  components: { JsonEditor },
  data() {
    return {
      session: {},
      renew: undefined,
      key: '',
      value: ''
    }
  },
  created() {
    this.getSession()
  },
  methods: {
    getSession() {
      this.renew = undefined
      request({
        url: 'admin/token.php',
        method: 'get'
      }).then(response => {
        this.session = response.data
        this.renew = response.renew
      })
    },
    addSession() {
      this.renew = undefined
      const data = { key: this.key, value: this.value }
      request({
        url: 'admin/token.php?add=1',
        method: 'post',
        data
      }).then(response => {
        this.session = response.data
        this.renew = response.renew
      })
    },
    removeSession() {
      this.renew = undefined
      request({
        url: 'admin/token.php?remove=1',
        method: 'post',
        data: { key: this.key }
      }).then(response => {
        this.session = response.data
        this.renew = response.renew
      })
    }
  }
}
</script>
<style scoped>
</style>
