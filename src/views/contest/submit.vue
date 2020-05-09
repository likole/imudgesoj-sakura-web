<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :lg="18" :sm="24">
        <el-card style="margin-bottom: 20px">
          <div>
            <h3 style="color: royalblue">问题描述</h3>
            <div v-html="problem.description" />
            <h3 style="color: royalblue">输入</h3>
            <div v-html="problem.input" />
            <h3 style="color: royalblue">输出</h3>
            <div v-html="problem.output" />
            <h3 style="color: royalblue">样例输入
              <el-button type="text" @click="handleCopy(problem.sample_input,$event)">复制</el-button>
            </h3>
            <pre v-html="problem.sample_input" />
            <h3 style="color: royalblue">样例输出
              <el-button type="text" @click="handleCopy(problem.sample_output,$event)">复制</el-button>
            </h3>
            <pre v-html="problem.sample_output" />
            <h3 v-show="problem.hint!=''" style="color: royalblue">提示</h3>
            <div v-show="problem.hint!=''" v-html="problem.hint" />
          </div>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <submit-component v-if="problem.problem_id" :cid="cid" :pid="pid" :input="problem.sample_input" />
        </el-card>
      </el-col>
      <el-col :lg="6" :sm="24">
        <el-card style="margin-bottom: 20px">
          <el-tag
            v-for="(item,index) in problems"
            :key="index"
            :type="item.status==='Y'?'success':item.status==='N'?'danger':'info'"
            :style=" 'margin: 5px; '+(item.id_num==pid?'cursor:default;':'cursor:pointer;')"
            @click="changeProblem(item.id_num)"
          >
            <span :style="item.id_num==pid?'color: royalblue;':''">{{ item.id }} - {{ item.title }} {{ item.ac }}/{{ item.submit }}</span>
          </el-tag>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <p>题目编号：{{ problem.problem_id }}</p>
          <p>标题：{{ problem.title }}</p>
          <p>来源分类：{{ problem.source }}</p>
          <p>添加时间：{{ problem.in_date }}</p>
          <p>时间限制：{{ problem.time_limit }}S</p>
          <p>空间限制：{{ problem.memory_limit }}MB</p>
          <p>AC/提交：{{ problem.accepted }}/{{ problem.submit }}</p>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="progress" />
        </el-card>
        <problem-status-component v-if="problem.problem_id" :id-for-update="idForUpdate" :in-contest="true" :pid="parseInt(problem.problem_id)" :is-single="false" />
      </el-col>
    </el-row>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="50"
        transition-name="fade"
      />
    </el-tooltip>
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import SubmitComponent from '../../components/submit/index'
import ProblemStatusComponent from '@/components/problem/ProblemStatus'
import BackToTop from '@/components/BackToTop'
import { fetchProblem, fetchProblems } from '@/api/contest'

export default {
  name: 'ContestSubmit',
  components: { BackToTop, ProblemStatusComponent, SubmitComponent },
  data() {
    return {
      tempRoute: {},
      cid: 0,
      pid: 0,
      problem: {},
      progress: 0,
      // 获取所有问题信息，用于切换问题
      problems: null,
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
    this.cid = parseInt(this.$route.params && this.$route.params.cid)
    this.pid = parseInt(this.$route.params && this.$route.params.pid)
    this.tempRoute = Object.assign({}, this.$route)
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchProblem(this.cid, this.pid).then(response => {
        this.problem = response.data
        // eslint-disable-next-line eqeqeq
        if (this.problem.submit == 0) {
          this.progress = 0
        } else {
          this.progress = parseInt(this.problem.accepted * 100 / this.problem.submit)
        }
        this.setTagsViewTitle()
        this.setPageTitle()
        // problem changer
        fetchProblems(this.cid).then(response => {
          this.problems = response.data.problemset
        })
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '提交'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-竞赛${this.cid}-${this.problem.title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '提交'
      document.title = `${title} - 竞赛${this.cid} - ${this.problem.title}`
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    // change #3
    changeProblem(id) {
      if (id !== this.pid) {
        this.pid = id
        this.fetchData()
      }
    }
  }
}
</script>
