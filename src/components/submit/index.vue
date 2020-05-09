<template>
  <div>
    <el-form v-loading="submitLoading">
      <div class="filter-container">
        <el-select v-model="language" style="width: 90px" @change="changeLanguage">
          <el-option v-for="item in allLanguages" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-checkbox v-model="testrunEnable" style="margin-left: 20px">
          测试运行
        </el-checkbox>
        <div v-if="true">
          <p>cid: {{ cid }} pid: {{ pid }}</p>
          <p>language:{{ language }} mode:{{ editor&&editor.getOption('mode') }}</p>
        </div>
      </div>

      <textarea ref="editor" v-model="source" style="height:300px;width:600px;" />

      <div v-show="testrunEnable" v-loading="testrunLoading" style="margin-top: 12px">
        <el-form-item label="输入">
          <el-input v-model="testrunInput" type="textarea" :autosize="true" />
        </el-form-item>
        <el-form-item label="输出">
          <el-input :value="testrunOutput" type="textarea" :autosize="true" />
        </el-form-item>
      </div>

      <div class="filter-container" style="margin-top: 12px">
        <el-button type="primary" @click="submitWrapper"> {{ submitted?'再次提交':'提交' }} </el-button>
        <el-button v-show="testrunEnable" v-loading="testrunLoading" type="primary" @click="testrunSubmit">测试运行</el-button>
        <el-button v-if="submitted" type="success" @click="dialogVisible=true">查看上次运行结果</el-button>
      </div>
    </el-form>

    <el-dialog
      :title="'运行状态（运行编号：'+solutionId+'）'"
      :visible.sync="dialogVisible"
      :show-close.sync="closeDlg"
      :close-on-click-modal.sync="closeDlg"
      :close-on-press-escape.sync="closeDlg"
      width="70%"
    >
      <span v-if="status.result==0">正在获取运行结果。。。</span>
      <div v-else :style="'color:'+colorMap[status.result]">
        <p>{{ status.result_name }}</p>
        <p>时间：{{ status.time }}</p>
        <p>内存：{{ status.memory }}</p>
        <p>判题机：{{ status.judger }}</p>
        <pre v-show="status.ce==true" v-html="ce" />
        <pre v-show="status.re==true" v-html="re" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
// core
import * as CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/lib/codemirror.css'
// theme
import 'codemirror/theme/monokai.css'
// mode
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/python/python'
// addon
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/scroll/annotatescrollbar'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/comment/continuecomment'
import 'codemirror/addon/display/autorefresh'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/jump-to-line'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/matchesonscrollbar.css'
import 'codemirror/addon/search/match-highlighter'
import 'codemirror/addon/display/fullscreen'

import { submitProblem, ajaxStatus, fetchRE, fetchCE } from '@/api/problem'

import Cookies from 'js-cookie'
import { MessageBox } from 'element-ui'

export default {
  name: 'SubmitComponent',
  props: {
    cid: {
      type: Number,
      default: 0
    },
    pid: {
      type: Number,
      required: true
    },
    input: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 所有可用的语言（id，显示的名字）
      allLanguages: [
        {
          value: '0', label: 'C'
        }, {
          value: '1', label: 'C++'
        }, {
          value: '3', label: 'Java'
        }, {
          value: '6', label: 'Python'
        }],
      // 语言id和代码高亮模式的对应
      languageModeMap: {
        0: 'text/x-csrc',
        1: 'text/x-c++src',
        3: 'text/x-java',
        6: 'text/x-python'
      },
      // 运行结果编号对应的显示颜色
      colorMap: {
        '0': '#909399',
        '1': '#000000',
        '2': '#E6A23C',
        '3': '#E6A23C',
        '4': '#67C23A',
        '5': '#F56C6C',
        '6': '#F56C6C',
        '7': '#E6A23C',
        '8': '#E6A23C',
        '9': '#E6A23C',
        '10': '#E6A23C',
        '11': '#E6A23C',
        '12': '#E6A23C',
        '13': '#000000'
      },
      // 当前选择的语言
      language: '1',
      // 编辑框中的内容
      source: '',
      // 代码编辑框
      editor: undefined,
      // 是否启用测试运行
      testrunEnable: false,
      // 测试运行时将处于读取状态
      testrunLoading: false,
      // 测试运行的输入文本
      testrunInput: '',
      // 测试运行的输出结果
      testrunOutput: '',
      // 测试运行的solution id
      testrunSolutionId: undefined,
      // 是否已经提交过
      submitted: false,
      // 提交时尚未获取到运行编号时
      submitLoading: false,
      // 显示运行详情的对话框
      dialogVisible: false,
      // 对话框是否可关闭
      closeDlg: false,
      // 提交后获取的运行编号，0代表尚未获取到
      solutionId: 0,
      // 运行结果
      status: {
        result: 0
      },
      re: null,
      ce: null
    }
  },
  watch: {
    input: {
      deep: true,
      handler(val) {
        this.testrunInput = this.input
      }
    }
  },
  mounted() {
    this.testrunInput = this.input
    this.editor = CodeMirror.fromTextArea(this.$refs.editor, {
      placeholder: '请 输入代码 或 拖拽文件至此\n\n' +
        '部分快捷键(Mac系统详见帮助文档)\n' +
        '代码提示\t\t`\n' +
        '删除当前行\tCtrl-D\n' +
        '查找\t\tCtrl-F\n' +
        '查找下一个\tCtrl-G\n' +
        '查找上一个\tShift-Ctrl-G\n' +
        '替换\t\tShift-Ctrl-F\n' +
        '替换全部\t\tShift-Ctrl-R\n' +
        '跳转\t\tAlt-G\n' +
        '网页全屏\t\tF11\n' +
        '退出全屏\t\tESC',
      indentUnit: 4,
      styleActiveLine: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      smartIndent: true,
      mode: 'text/x-c++src',
      indentWithTabs: true,
      lineNumbers: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      theme: 'monokai',
      scrollbarStyle: 'overlay',
      lineWiseCopyCut: true,
      foldCode: true,
      continueComments: true,
      continueLineComment: false,
      extraKeys: {
        '`': 'autocomplete',
        'F11': function(cm) {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'))
        },
        'Esc': function(cm) {
          if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false)
        } },
      autoRefresh: true,
      showCursorWhenSelecting: true,
      highlightSelectionMatches: { annotateScrollbar: true }
    })
    // 恢复上次使用的语言
    const lastLanguage = Cookies.get('IMUDGESOJ-SAKURA-LANGUAGE')
    if (lastLanguage !== undefined) {
      this.language = lastLanguage
      this.changeLanguage(lastLanguage)
    }
  },
  methods: {
    // 更改语言时更换编辑器模式并记录在cookie中
    changeLanguage(language) {
      this.editor.setOption('mode', this.languageModeMap[language])
      Cookies.set('IMUDGESOJ-SAKURA-LANGUAGE', language, { expires: 30 })
    },
    // 测试运行提交
    testrunSubmit() {
      this.testrunLoading = true
      if (this.cid === 0) {
        // 竞赛外
        submitProblem({ 'id': -this.pid, 'source': this.editor.getValue(), 'input_text': this.testrunInput, 'language': this.language }).then(response => {
          this.testrunSolutionId = parseInt(response.data)
          setTimeout(this.testrunFetchStatus, 500)
        }).catch(() => {
          this.testrunLoading = false
        })
      } else {
        // 竞赛里
        submitProblem({ 'cid': -this.cid, 'pid': this.pid, 'source': this.editor.getValue(), 'input_text': this.testrunInput, 'language': this.language }).then(response => {
          this.testrunSolutionId = parseInt(response.data)
          setTimeout(this.testrunFetchStatus, 500)
        }).catch(() => {
          this.testrunLoading = false
        })
      }
    },
    // 测试运行获取结果
    testrunFetchStatus() {
      ajaxStatus({ 'solution_id': this.testrunSolutionId, 'tr': 1 }).then(response => {
        if (response.data.result === 0)setTimeout(this.testrunFetchStatus, 1500)
        else {
          this.testrunOutput = response.data.error
          this.testrunLoading = false
        }
      })
    },
    // 在提交外面添加了检查
    submitWrapper() {
      const lastCode = Cookies.get('IMUDGESOJ-SAKURA-HISTORY-' + this.cid + '-' + this.pid + '-' + this.language)
      if (lastCode !== undefined && lastCode === this.editor.getValue()) {
        MessageBox.confirm('检测到该代码已提交过，是否确定重复提交', '重复提交', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submit()
        })
      } else {
        this.submit()
      }
    },
    submit() {
      let submitData = {}
      if (this.cid === 0) {
        submitData = { 'id': this.pid, 'source': this.editor.getValue(), 'language': this.language }
      } else {
        submitData = { 'cid': this.cid, 'pid': this.pid, 'source': this.editor.getValue(), 'language': this.language }
      }
      this.submitLoading = true
      submitProblem(submitData).then(response => {
        this.solutionId = parseInt(response.data)
        this.submitted = true
        this.status = { 'result': 0 }
        this.re = null
        this.ce = null
        this.closeDlg = false
        this.dialogVisible = true
        setTimeout(500, this.fetchStatus())
        // 记录代码在本地
        Cookies.set('IMUDGESOJ-SAKURA-HISTORY-' + this.cid + '-' + this.pid + '-' + this.language, this.editor.getValue())
        this.submitLoading = false
      }).catch(() => {
        this.submitLoading = false
      })
    },
    fetchStatus() {
      ajaxStatus({ 'solution_id': this.solutionId }).then(response => {
        this.status = response.data
        if (parseInt(this.status.result) < 4)setTimeout(this.fetchStatus, 1500)
        else {
          if (this.status.ce === true) {
            fetchCE(this.solutionId).then(response => {
              this.ce = response.data.detail
            })
          }
          if (this.cid === 0 && this.status.re === true) {
            fetchRE(this.solutionId).then(response => {
              this.re = response.data.detail
            })
          }
          this.closeDlg = true
          this.$emit('ac')
        }
      }
      )
    }
  }
}
</script>
<style>
  .cm-matchhighlight {
    color: white !important;
    background-color: red;
  }
  .CodeMirror-selection-highlight-scrollbar {background-color: red}
  .CodeMirror-fullscreen {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    height: auto;
    z-index: 9999;
  }
</style>
