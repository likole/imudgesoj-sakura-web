<template>
  <div class="app-container">
    <el-card>
      <submit-component :pid="1001" input=""/>
    </el-card>
  </div>
</template>
<script>
import SubmitComponent from '../../components/submit/index'
export default {
  name: 'DevelopTest',
  components: { SubmitComponent }
}
</script>
<style scoped>
</style>
