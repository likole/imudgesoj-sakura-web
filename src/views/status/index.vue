<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的提交" name="self">
        <div v-if="activeName==='self'">
          <self-status-component />
        </div>
      </el-tab-pane>
      <el-tab-pane label="所有提交" name="all">
        <div v-if="activeName==='all'">
          <all-status-component />
        </div>
      </el-tab-pane>
      <el-tab-pane label="旧版" name="old">
        <div v-if="activeName==='old'">
          <status-component />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SelfStatusComponent from './components/SelfStatus'
import AllStatusComponent from './components/AllStatus'
import StatusComponent from '@/components/status/index'

export default {
  name: 'Status',
  components: { SelfStatusComponent, AllStatusComponent, StatusComponent },
  data() {
    return {
      activeName: 'self'
    }
  }
}
</script>
<style scoped>

</style>
