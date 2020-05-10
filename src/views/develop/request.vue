<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="BaseUrl">
        <el-input v-model="requestDetail.baseUrl" />
      </el-form-item>
      <el-form-item label="Url">
        <el-input v-model="requestDetail.url" />
      </el-form-item>
      <el-form-item label="Method">
        <el-radio v-model="requestDetail.method" label="GET">GET</el-radio>
        <el-radio v-model="requestDetail.method" label="POST">POST</el-radio>
        <el-radio v-model="requestDetail.method" label="PUT">PUT</el-radio>
        <el-radio v-model="requestDetail.method" label="PATCH">PATCH</el-radio>
        <el-radio v-model="requestDetail.method" label="DELETE">DELETE</el-radio>
      </el-form-item>
      <json-editor v-model="requestDetail.data" />
      <el-button style="margin-top: 20px" type="primary" @click="sendRequest">发送请求</el-button>
    </el-form>
    <json-editor v-model="response" style="margin-top: 20px" />
  </div>
</template>
<script>
import request from '@/utils/request'
import JsonEditor from '@/components/JsonEditor'
export default {
  name: 'DevelopRequest',
  components: { JsonEditor },
  data() {
    return {
      requestDetail: { baseUrl: 'https://acm.likole.com/sakura/', url: '', method: 'GET', data: {}},
      response: {}
    }
  },
  methods: {
    sendRequest() {
      request({
        url: this.requestDetail.baseUrl + this.requestDetail.url,
        method: this.requestDetail.method
      }).then(response => {
        this.response = response
      })
    }
  }
}
</script>
<style scoped>
</style>
