<template>
  <div class="dashboard-editor-container">
    <el-card v-if="unread!==0" style="margin-bottom: 20px">
     您有 <b style="color: red">{{ unread }}</b> 条新消息，请前往 <router-link to="/mail" class="link-type">站内信</router-link> 查看~
    </el-card>
    <el-row class="dashboard-chart-container">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-card v-for="(item,index) in news" :key="index" class="box-card" style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>{{ item.title }} - {{ item.user_id }}</span>
        <span style="float: right">{{ item.time }}</span>
      </div>
      <div v-html="item.content" />
    </el-card>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import { fetchChart } from '@/api/dashboard'
import { fetchUnreadCount } from '@/api/mail'

export default {
  name: 'DashboardUser',
  components: {
    LineChart
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
      fetchUnreadCount().then(response => {
        this.unread = response.data
      })
      fetchChart().then(response => {
        this.lineChartData = response.data.chart
        this.news = response.data.news
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

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
