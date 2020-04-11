<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>详细答题情况</span>
      </div>
      <p v-for="(item,index) in problem" :key="index">{{ item[0] }}:{{ item[1] }}</p>
      <pie-chart :chart-data="status" />
    </el-card>
    <el-card>
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
      type: String
    },
    idForUpdate: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      problem: {},
      status: {},
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
