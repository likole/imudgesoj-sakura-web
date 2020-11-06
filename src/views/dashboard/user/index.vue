<template>
  <div class="dashboard-editor-container">
    <!--    <panel-group @handleSetLineChartData="handleSetLineChartData" />-->
    <el-card v-if="unread!==0" style="margin-bottom: 20px">
      您有 <b style="color: red">{{ unread }}</b> 条新消息，请前往 <router-link to="/mail" class="link-type">站内信</router-link> 查看~
    </el-card>

    <el-row class="dashboard-chart-container">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-card v-for="(item,index) in news" :key="index" class="box-card" style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>{{ item.title }} - {{ item.username }}</span>
        <span style="float: right">{{ item.time }}</span>
      </div>
      <div v-html="item.content" />
    </el-card>

    <!--    <el-row :gutter="32">-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <raddar-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <pie-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <bar-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <!--    <el-row :gutter="8">-->
    <!--      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">-->
    <!--        <transaction-table />-->
    <!--      </el-col>-->
    <!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
    <!--        <todo-list />-->
    <!--      </el-col>-->
    <!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
    <!--        <box-card />-->
    <!--      </el-col>-->
    <!--    </el-row>-->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

import { fetchDashboardData } from '@/api/dashboard'

export default {
  name: 'DashboardUser',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart
    // RaddarChart,
    // PieChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      unread: 0,
      lineChartData: { all: [], ac: [] },
      news: null
    }
  },
  created() {
    this.getAll()
  },
  methods: {
    getAll() {
      fetchDashboardData().then(response => {
        this.lineChartData = response.data.chart
        this.news = response.data.news
        this.unread = response.data.mail
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-dark {
  .dashboard-chart-container {
    background: #333;
  }

  .dashboard-editor-container {
    background-color: #000;

    .chart-wrapper {
      background: #000;
    }
  }
}

.dashboard-chart-container {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

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
