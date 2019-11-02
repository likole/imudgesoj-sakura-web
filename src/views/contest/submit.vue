<template>
  <div class="app-container">
<!--    <submit-component />-->
  还没写呢
  </div>
</template>
<script>
// import SubmitComponent from '@/componets/submit/index'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ContestSubmit',
  directives: { waves },
  // components: { SubmitComponent },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      score_log: null,
      score: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // fetchList().then(response => {
      //   this.score_log = response.data.score_log
      //   this.score = response.data.score
      // })
    }
  }
}
</script>

<style scoped>

</style>
