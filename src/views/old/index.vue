<template>
  <div class="app-container">
    <el-button type="primary" size="large" @click="visit">点击此处访问旧版</el-button>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'OldIndex',
  data() {
    return {
      address: ''
    }
  },
  methods: {
    visit() {
      window.open('https://acm.likole.com/old/loginpage.php?token=' + getToken())
    }
  }
}
</script>

<style scoped>

</style>
