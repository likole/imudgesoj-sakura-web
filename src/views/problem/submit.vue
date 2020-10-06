<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :lg="{span:6,push:18}" :md="24">
        <el-card style="margin-bottom: 20px">
          <p>题目编号：{{ problem.id }}</p>
          <p>标题：{{ problem.title }}</p>
          <p>来源分类：{{ problem.source }}</p>
          <p>添加时间：{{ problem.inDate }}</p>
          <p>时间限制：{{ problem.timeLimit }}S</p>
          <p>空间限制：{{ problem.memoryLimit }}MB</p>
          <p>AC/提交：{{ problem.accepted }}/{{ problem.submit }}</p>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="progress" />
        </el-card>
        <problem-status-component class="hidden-md-and-down" :id-for-update="idForUpdate" :pid="problemId" :is-single="false" style="margin-top: 20px" />
      </el-col>
      <el-col :lg="{span:18,pull:6}" :md="24">
        <el-card style="margin-bottom: 20px">
          <div>
            <h3 style="color: royalblue">问题描述</h3>
            <div v-html="problem.description" />
            <h3 style="color: royalblue">输入</h3>
            <div v-html="problem.input" />
            <h3 style="color: royalblue">输出</h3>
            <div v-html="problem.output" />
            <h3 style="color: royalblue">样例输入 <el-button type="text" @click="handleCopy(problem.sample_input,$event)">复制</el-button></h3>
            <pre v-html="problem.sampleInput" />
            <h3 style="color: royalblue">样例输出 <el-button type="text" @click="handleCopy(problem.sample_output,$event)">复制</el-button></h3>
            <pre v-html="problem.sampleOutput" />
            <h3 v-show="problem.hint!=''" style="color: royalblue">提示</h3>
            <div v-show="problem.hint!=''" v-html="problem.hint" />
          </div>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <submit-component v-if="problem.id" :pid="problemId" :input="problem.sampleInput" @ac="fetchData(problemId)" />
        </el-card>
      </el-col>
    </el-row>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import SubmitComponent from '../../components/submit/index'
import ProblemStatusComponent from '@/components/problem/ProblemStatus'
import BackToTop from '@/components/BackToTop'
import { fetchProblem } from '@/api/problem'
import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'ProblemSubmit',
  components: { BackToTop, ProblemStatusComponent, SubmitComponent },
  filters: {
    numFilter(value) {
      // 截取当前数据到小数点后两位
      const realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  },
  data() {
    return {
      problemId: 0,
      tempRoute: {},
      problem: {},
      progress: 0,
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      idForUpdate: 1
    }
  },
  created() {
    this.problemId = this.$route.params && parseInt(this.$route.params.id)
    this.tempRoute = Object.assign({}, this.$route)
    this.fetchData(this.problemId)
  },
  methods: {
    fetchData(id) {
      fetchProblem(id).then(response => {
        this.problem = response.data
        // eslint-disable-next-line eqeqeq
        if (this.problem.submit == 0) this.progress = 0
        else this.progress = parseInt(this.problem.accepted * 100 / this.problem.submit)
        this.idForUpdate++
        this.setTagsViewTitle()
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '提交'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.problemId}-${this.problem.title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '提交'
      document.title = `${title} - ${this.problemId} - ${this.problem.title}`
    },
    handleCopy(text, event) {
      clip(text, event)
    }
  }
}
</script>
