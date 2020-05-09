<template>
  <div class="app-container">
    <el-card class="box-card" style="margin-bottom: 20px">
      <p>如果您觉得 IMUDGESOJ 所提供的服务给您带来了帮助，您可以考虑扫描下方的{{ pay?'支付宝收款码':'红包码' }}，来继续鼓励支持我~</p>
      <div align="center">
        <img v-if="pay" src="@/assets/alipay.png" height="205px">
        <img v-else src="@/assets/red_envelope.png" height="200px">
        <br>
        <el-button type="text" @click="pay=!pay">{{ pay?'切换为红包码':'土豪可点击此处切换为 支付宝收款码' }}</el-button>
      </div>
    </el-card>
    <el-card>
      <p>本站搭建在云服务器上，每月都有着一定的运营费用，你的捐助将用于：</p>
      <ul>
        <li>云服务器续费</li>
        <li>CDN服务续费</li>
        <li>学院OJ代理服务（服务器配置不够已停止维护）</li>
        <li>服务器配置升级</li>
        <li>新OJ日常维护</li>
        <li>新OJ题库的建立（大多题目是需要购买的）</li>
        <li>买肥宅快乐水～</li>
      </ul>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HelpDonate',
  data() {
    return {
      pay: false
    }
  }
}
</script>

<style scoped>

</style>
