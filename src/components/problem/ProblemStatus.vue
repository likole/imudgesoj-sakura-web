<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>详细答题情况</span>
      </div>
      <p v-for="(item,index) in problem" :key="index">{{ item[0] }}: {{ item[1] }}</p>
      <pie-chart :chart-data="status" />
      <p v-if="inContest" style="font-size: 10px">* 此数据为该问题的数据，而非竞赛数据</p>
      <router-link v-if="!isSingle" :to="'/problem/status/'+pid">
        <el-button type="success" style="margin-top: 10px;width: 100%;">查看问题状态详情</el-button>
      </router-link>
    </el-card>
    <el-card v-if="!isSingle&&!inContest">
      <div slot="header" class="clearfix">
        <span>推荐题目</span>
      </div>
      <span v-for="(item,index) in recommend" :key="index">
        <router-link :to="'/problem/submit/'+item[0]" class="link-type">
          <span>{{ item[0] }} </span>
        </router-link>
      </span>
    </el-card>
  </div>
</template>

<script>
import { fetchProblemStatus } from '@/api/problem'
import PieChart from './PieChart'

export default {
  name: 'ProblemStatusComponent',
  components: { PieChart },
  props: {
    pid: {
      required: true,
      type: Number
    },
    idForUpdate: {
      type: Number,
      default: 1
    },
    inContest: {
      type: Boolean,
      default: false
    },
    isSingle: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      problem: {},
      status: [],
      recommend: {}
    }
  },
  watch: {
    idForUpdate: {
      deep: true,
      handler(val) {
        this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchProblemStatus(this.pid).then(response => {
        this.problem = response.data.problem
        this.status = response.data.status
        this.solution = response.data.solution
        this.recommend = response.data.recommend
      })
    }
  }
}
</script>
