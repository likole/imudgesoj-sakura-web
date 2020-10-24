<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="招新管理" name="admin">
        <div v-if="activeName==='admin'">
          <recruit-admin />
        </div>
      </el-tab-pane>
      <el-tab-pane label="分组管理" name="group">
        <div v-if="activeName==='group'">
          <interview-group />
        </div>
      </el-tab-pane>
      <el-tab-pane label="参数设置" name="options">
        <div v-if="activeName==='options'">
          <recruit-options />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import RecruitOptions from './components/RecruitOptions'
import RecruitAdmin from './components/RecruitAdmin'
import InterviewGroup from './components/InterviewGroup'

export default {
  name: 'ImudgesRecruitAdmin',
  components: { RecruitOptions, RecruitAdmin, InterviewGroup },
  data() {
    return {
      activeName: 'admin'
    }
  }
}
</script>
