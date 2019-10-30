<template>
  <div class="dashboard-editor-container">

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

  </div>
</template>

<script>
import LineChart from './components/LineChart'
import { fetchChart } from '@/api/dashboard'

export default {
  name: 'DashboardUser',
  components: {
    LineChart
  },
  data() {
    return {
      lineChartData: null
    }
  },
  created() {
    this.loadChart()
  },
  methods: {
    loadChart() {
      fetchChart().then(response => {
        this.lineChartData = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
