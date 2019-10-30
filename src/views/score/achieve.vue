<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>每日礼包一</span>
          </div>
          <p>
            刷题满3题即可领取。
          </p>
          <el-button type="success">领取</el-button>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { fetchList } from '@/api/score'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ScoreAchieve',
  directives: { waves },
  data() {
    return {
      score: 0
    }
  },
  created() {
    this.getStatus()
  },
  methods: {
    getStatus() {
      fetchList().then(response => {
        this.score_log = response.data.score_log
        this.score = response.data.score
      })
    }
  }
}
</script>

<style scoped>

</style>
