<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card style="margin-bottom: 20px">
          <div>
            <h3 style="color: royalblue">问题描述</h3>
            <div v-html="problem.description" />
            <h3 style="color: royalblue">输入</h3>
            <div v-html="problem.input" />
            <h3 style="color: royalblue">输出</h3>
            <div v-html="problem.output" />
            <h3 style="color: royalblue">样例输入 <el-button type="text" @click="handleCopy(problem.sample_input,$event)">复制</el-button></h3>
            <pre v-html="problem.sample_input" />
            <h3 style="color: royalblue">样例输出 <el-button type="text" @click="handleCopy(problem.sample_output,$event)">复制</el-button></h3>
            <pre v-html="problem.sample_output" />
          </div>
        </el-card>
        <el-card>
          <el-form ref="form" :model="form" label-width="80px">
            <el-select v-model="language" style="width: 90px;margin-bottom: 12px" class="filter-item">
              <el-option v-for="item in languages" :key="item" :label="item" :value="item" />
            </el-select>
            <textarea ref="mycode" v-model="code" class="codesql" style="height:300px;width:600px;" />
            <el-button style="margin-top: 12px" type="primary" @click="submit">提交</el-button>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <p>题目编号：{{ problem.problem_id }}</p>
          <p>标题：{{ problem.title }}</p>
          <p>来源分类：{{ problem.source }}</p>
          <p>添加时间：{{ problem.in_date }}</p>
          <p>时间限制：{{ problem.time_limit }}S</p>
          <p>空间限制：{{ problem.memory_limit }}MB</p>
          <p>AC/提交：{{ problem.accepted }}/{{ problem.submit }}</p>
          <el-progress :text-inside="true" :stroke-width="26" :percentage=" problem.accepted/problem.submit*100 |numFilter" />
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="正在判题中。。。"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/addon/hint/show-hint.css'
const CodeMirror = require('codemirror/lib/codemirror')
import { fetchProblem } from '@/api/problems'
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

export default {
  name: 'ProblemsSubmit',
  filters: {
    numFilter(value) {
      // 截取当前数据到小数点后两位
      const realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  },
  data() {
    return {
      id: 0,
      tempRoute: {},
      code: '',
      languages: ['C', 'C++', 'Java', 'Python'],
      language: 'C++',
      problem: {},
      dialogVisible: false
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    this.tempRoute = Object.assign({}, this.$route)
    this.fetchData(this.id)
  },
  mounted() {
    const mime = 'text/x-c++src'
    const theme = 'monokai'
    const editor = CodeMirror.fromTextArea(this.$refs.mycode, {
      placeholder: this.code,
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
    fetchData(id) {
      fetchProblem(id).then(response => {
        this.problem = response.data
        this.setTagsViewTitle()
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '提交'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}-${this.problem.title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '提交'
      document.title = `${title} - ${this.id} - ${this.problem.title}`
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    submit() {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
