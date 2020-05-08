<template>
  <div class="app-container">
    <h3>目前积分：{{ score }}</h3>
    <el-card class="box-card" style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>普通会员</span>
      </div>
      <p>
        可以查看答案错误详情
      </p>
      <el-button type="primary" v-show="vip1==0" @click="updateStatus(11)">开通一天（10积分）</el-button>
      <br v-if="device==='mobile'">
      <el-button type="success" v-show="vip1==0" :style="device==='mobile'?'margin-top:10px':''" @click="updateStatus(12)">开通七天（50积分）</el-button>
      <el-button v-show="vip1==1" disabled="disabled">您已开通</el-button>
    </el-card>

  </div>
</template>
<script>
import { fetchVip, openVip } from '@/api/score'
import waves from '@/directive/waves' // waves directive
import { mapState } from 'vuex'
export default {
  name: 'ScoreVIP',
  directives: { waves },
  data() {
    return {
      score: 0,
      vip1: -1
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  created() {
    this.getStatus()
  },
  methods: {
    getStatus() {
      fetchVip().then(response => {
        this.vip1 = response.data.vip1
        this.score = response.data.score
      })
    },
    updateStatus(id) {
      openVip(id).then(response => {
        this.vip1 = response.data.vip1
        this.score = response.data.score
      })
    }
  }
}
</script>

<style scoped>

</style>
