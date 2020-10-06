<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :md="24" :lg="8">
        <problem-status-component :pid="problemId" :is-single="true" />
      </el-col>
      <el-col :md="24" :lg="16">
        <problem-status-detail-component :pid="problemId" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ProblemStatusComponent from '@/components/problem/ProblemStatus'
import ProblemStatusDetailComponent from '@/components/problem/ProblemStatusDetail'

export default {
  name: 'ProblemStatus',
  components: { ProblemStatusDetailComponent, ProblemStatusComponent },
  data() {
    return {
      problemId: 0,
      tempRoute: {}
    }
  },
  created() {
    this.problemId = this.$route.params && parseInt(this.$route.params.id)
    this.tempRoute = Object.assign({}, this.$route)
  },
  mounted() {
    this.setTagsViewTitle()
    this.setPageTitle()
  },
  methods: {
    setTagsViewTitle() {
      const title = '问题状态'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.problemId}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '问题状态'
      document.title = `${title} - ${this.problemId}`
    }
  }
}
</script>
