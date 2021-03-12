<template>
  <div style="background-color: white" align="center">
    <div style="margin-bottom: 10px;cursor: pointer">
      <el-tooltip placement="top">
        <div slot="content">
          <p>本站搭建在云服务器上，每月都有着一定的运营费用，您的捐助将用于：</p>
          <ul>
            <li>云服务器及域名续费</li>
            <li>CDN加速服务消耗</li>
            <li>短信服务消耗</li>
            <li>新OJ日常维护 & 进一步开发</li>
            <li>新OJ题库的建立（大多题目是需要购买的）</li>
          </ul>
        </div>
        <span>欢迎捐助 <i class="el-icon-question" style="color: royalblue" /></span>
      </el-tooltip>
    </div>
    <div v-if="type===0">
      <img src="@/assets/red_envelope.jpg" width="100px" height="100px" alt="">
      <p style="font-size: 12px">支付宝扫码领红包</p>
    </div>
    <div v-else-if="type===1">
      <img src="@/assets/alipay.jpg" width="100px" height="100px" alt="">
      <p style="font-size: 12px">支付宝收款码</p>
    </div>
    <div v-else>
      <img src="@/assets/mm_reward.png" width="100px" height="100px" alt="">
      <p style="font-size: 12px">微信赞赏码</p>
    </div>
    <el-button v-if="type!==0" type="text" @click="type=0">切换为支付宝红包码</el-button>
    <el-button v-if="type!==1" type="text" @click="type=1">切换为支付宝收款码</el-button>
    <el-button v-if="type!==2" type="text" @click="type=2">切换为微信赞赏码</el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DonateLink',
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  data() {
    return {
      type: 0
    }
  }
}
</script>

<style scoped>

</style>
