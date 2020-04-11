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
          <el-form ref="form" :model="form" label-width="80px" label-position="top">
            <el-select v-model="submitData.language" style="width: 90px;margin-bottom: 12px" class="filter-item">
              <el-option v-for="item in languages" :key="item.k" :label="item.k" :value="item.v" />
            </el-select>
            <el-checkbox v-model="testrun" class="filter-item" style="margin-left:15px;">
              测试运行
            </el-checkbox>
            <textarea ref="mycode" v-model="submitData.source" class="codesql" style="height:300px;width:600px;" />
            <el-form-item v-show="testrun" label="输入" style="margin-top: 12px ">
              <el-input v-model="input_text" type="textarea" :autosize="true" />
            </el-form-item>
            <el-form-item v-show="testrun" label="输出" style="margin-top: 12px ">
              <el-input :value="output_text" type="textarea" :autosize="true" />
            </el-form-item>
            <el-button style="margin-top: 12px" type="primary" @click="submit">{{ submitBtnText }}</el-button>
            <el-button v-show="testrun" style="margin-top: 12px" type="primary" @click="submit1">测试运行</el-button>
            <el-button
              v-show="submitBtnText=='再次提交'"
              style="margin-top: 12px"
              type="success"
              @click="dialogVisible=true"
            >查看上次运行结果
            </el-button>
          </el-form>
        </el-card>
      </el-col>
      <el-col :lg="6" :sm="24">
        <el-card style="margin-bottom: 20px">
          <span v-for="(item,index) in problems" :key="index">
            <el-tag :type="item.status=='Y'?'success':item.status=='N'?'danger':'info'" style="margin: 5px" @click="changeProblem(item.id_num)">
              <span v-if="item.id_num==submitData.pid" style="color: royalblue"><b>Now</b></span>
              <span v-else>{{ item.id }}</span>
            </el-tag>
          </span>
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
        <problem-status-component v-if="problem.problem_id" :id-for-update="idForUpdate" :in-contest="true" :pid="problem.problem_id" />
      </el-col>
    </el-row>
    <el-dialog
      title="运行状态"
      :visible.sync="dialogVisible"
      :show-close.sync="closeDlg"
      :close-on-click-modal.sync="closeDlg"
      :close-on-press-escape.sync="closeDlg"
      width="70%"
    >
      <span v-show="solution_id==0">{{ statusHint }}</span>
      <div v-show="solution_id!=0">
        <p>运行编号：{{ solution_id }}</p>
        <span v-show="status.result==0">正在获取运行结果。。。</span>
        <div v-show="status.result!=0">
          <p>运行结果：{{ status.result_name }}</p>
          <p>时间：{{ status.time }}</p>
          <p>内存：{{ status.memory }}</p>
          <p>判题机：{{ status.judger }}</p>
          <pre v-show="status.ce==true" v-html="ce" />
          <pre v-show="status.re==true" v-html="re" />
        </div>
      </div>

    </el-dialog>
    <el-dialog
      title="测试运行"
      :visible.sync="dialogVisible1"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      正在获取运行结果，请耐心等待
    </el-dialog>
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
import ProblemStatusComponent from '@/components/problem/ProblemStatus'
import ProblemStatusDetailComponent from '@/components/problem/ProblemStatusDetail'
import BackToTop from '@/components/BackToTop'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/addon/hint/show-hint.css'

const CodeMirror = require('codemirror/lib/codemirror')
import { fetchProblem, fetchProblems } from '@/api/contest'
import { submitProblem, ajaxStatus, fetchCE } from '@/api/problem'

require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/addon/hint/show-hint')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/xml/xml')
require('codemirror/mode/css/css')
require('codemirror/mode/htmlmixed/htmlmixed')
require('codemirror/mode/cmake/cmake')
require('codemirror/mode/clike/clike')
require('codemirror/mode/php/php')
require('codemirror/mode/python/python')
require('codemirror/mode/ruby/ruby')
require('codemirror/mode/lua/lua')
require('codemirror/mode/go/go')

/*
  与problem/submit不同之处:
  1.submitData中id变成cid和pid,同时created函数.submit1中的函数,fetchProblem函数,设置标题也要跟着改下
  2.去掉Re信息的获取
  3.加入题目状态和切换题目
   */
export default {
  name: 'ContestSubmit',
  components: { BackToTop, ProblemStatusComponent, ProblemStatusDetailComponent },
  filters: {
    numFilter(value) {
      // 截取当前数据到小数点后两位
      const realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  },
  data() {
    return {
      tempRoute: {},
      languages: [{ 'k': 'C', 'v': 0 }, { 'k': 'C++', 'v': 1 }, { 'k': 'Java', 'v': 3 }, { 'k': 'Python', 'v': 6 }],
      problem: {},
      progress: 0,
      dialogVisible: false,
      dialogVisible1: false,
      editor: undefined,
      submitData: {
        cid: 0,
        pid: 0,
        source: '',
        language: 1
      },
      solution_id: 0,
      solution_id1: 0,
      closeDlg: false,
      status: {
        result: 0
      },
      re: null,
      ce: null,
      submitBtnText: '提交',
      statusHint: '正在获取运行编号。。。',
      // customizable button style, show/hide critical point, return position
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      testrun: false,
      input_text: '',
      output_text: '',
      problems: null,
      idForUpdate: 1
    }
  },
  created() {
    this.submitData.cid = parseInt(this.$route.params && this.$route.params.cid)
    this.submitData.pid = parseInt(this.$route.params && this.$route.params.pid)
    this.tempRoute = Object.assign({}, this.$route)
  },
  mounted() {
    this.fetchData()
    const mime = 'text/x-c++src'
    const theme = 'monokai'
    this.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
      placeholder: this.submitData.source,
      indentUnit: 4,
      styleActiveLine: true,
      lineWrapping: true,
      mode: mime,
      indentWithTabs: true,
      lineNumbers: true,
      matchBrackets: true,
      theme: theme,
      extraKeys: { 'Tab': 'autocomplete' }
    })
  },
  methods: {
    fetchData() {
      fetchProblem(this.submitData.cid, this.submitData.pid).then(response => {
        this.problem = response.data
        // eslint-disable-next-line eqeqeq
        if (this.problem.submit == 0) {
          this.progress = 0
        } else {
          this.progress = parseInt(this.problem.accepted * 100 / this.problem.submit)
        }
        this.input_text = this.problem.sample_input
        this.setTagsViewTitle()
        this.setPageTitle()
        // change #3
        fetchProblems(this.submitData.cid).then(response => {
          this.problems = response.data.problemset
        })
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '提交'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-竞赛${this.submitData.cid}-${this.problem.title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '提交'
      document.title = `${title} - 竞赛${this.submitData.cid} - ${this.problem.title}`
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    submit() {
      this.closeDlg = false
      this.solution_id = 0
      this.ce = null
      this.re = null
      this.status = { 'result': 0 }
      this.dialogVisible = true
      this.submitData.source = this.editor.getValue()
      submitProblem(this.submitData).then(response => {
        this.solution_id = parseInt(response.data)
        this.getStatus()
      }).catch(err => {
        this.statusHint = err
        this.closeDlg = true
      })
    },
    submit1() {
      this.dialogVisible1 = true
      submitProblem({
        'cid': -this.submitData.cid,
        'pid': this.submitData.pid,
        'source': this.editor.getValue(),
        'input_text': this.input_text,
        'language': this.submitData.language
      }).then(
        response => {
          this.solution_id1 = parseInt(response.data)
          this.getStatus1()
        }
      ).catch(() => {
        this.dialogVisible1 = false
      })
    },
    getStatus() {
      ajaxStatus({ 'solution_id': this.solution_id }).then(response => {
        this.status = response.data
        if (parseInt(this.status.result) < 4) {
          setTimeout(this.getStatus, 2000)
        } else {
          if (this.status.ce === true) {
            fetchCE(this.solution_id).then(response => {
              this.ce = response.data.detail
            })
          }
          this.submitBtnText = '再次提交'
          this.closeDlg = true
          this.fetchData(this.submitData.id)
        }
      }
      )
    },
    getStatus1() {
      ajaxStatus({ 'solution_id': this.solution_id1, 'tr': 1 }).then(response => {
        if (response.data.result === 0) {
          setTimeout(this.getStatus1, 2000)
        } else {
          this.output_text = response.data.error
          this.dialogVisible1 = false
        }
      }
      )
    },
    // change #3
    changeProblem(id) {
      if (id !== this.submitData.pid) {
        this.submitData.pid = id
        this.fetchData()
        this.closeDlg = false
        this.solution_id = 0
        this.ce = null
        this.re = null
        this.status = { 'result': 0 }
        this.dialogVisible = false
        this.dialogVisible1 = false
        this.submitBtnText = '提交'
        this.statusHint = '正在获取运行编号。。。'
        this.output_text = ''
        this.editor.setValue('')
      }
    }
  }
}
</script>

<style scoped>

</style>
