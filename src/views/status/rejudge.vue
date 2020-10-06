<template>
  <div class="app-container">
    <el-alert :closable="false" type="warning" style="margin-bottom: 20px">
      <h3>请谨慎操作！</h3>
    </el-alert>
    <el-form label-position="left" label-width="80px">
      <el-form-item label="重判类型">
        <el-radio v-model="type" label="0">重判问题</el-radio>
        <el-radio v-model="type" label="1">重判运行</el-radio>
        <el-radio v-model="type" label="2">重判竞赛</el-radio>
      </el-form-item>
      <el-form-item :label="name">
        <el-input v-model="id" type="number" />
      </el-form-item>
      <el-button type="warning" :disabled="disabled" @click="rejudge">{{ buttonText }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { rejudgeProblem, rejudgeSolution, rejudgeContest } from '../../api/rejudge'

export default {
  name: 'StatusRejudge',
  data() {
    return {
      type: '1',
      name: '运行编号',
      id: undefined,
      disabled: false,
      buttonText: '重判'
    }
  },
  watch: {
    type: {
      deep: true,
      handler(val) {
        if (this.type === '0') {
          this.name = '问题编号'
        } else if (this.type === '1') {
          this.name = '运行编号'
        } else if (this.type === '2') {
          this.name = '竞赛编号'
        }
      }
    }
  },
  methods: {
    rejudge() {
      this.disabled = true
      this.buttonText = '请勿重复操作，如需继续操作请先刷新页面'
      if (this.type === '0') {
        rejudgeProblem(this.id).then(() => {
          this.$message({ 'type': 'success', 'message': '已加入重判队列，请耐心等待' })
        }).catch(() => {
          this.disabled = false
          this.buttonText = '重判'
        })
      } else if (this.type === '1') {
        rejudgeSolution(this.id).then(() => {
          this.$message({ 'type': 'success', 'message': '已加入重判队列，请耐心等待' })
        }).catch(() => {
          this.disabled = false
          this.buttonText = '重判'
        })
      } else if (this.type === '2') {
        rejudgeContest(this.id).then(() => {
          this.$message({ 'type': 'success', 'message': '已加入重判队列，请耐心等待' })
        }).catch(() => {
          this.disabled = false
          this.buttonText = '重判'
        })
      }
    }
  }
}
</script>
<style scoped>

</style>
