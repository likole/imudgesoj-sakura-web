<template>
  <div>
    <el-form>
      <div class="filter-container">
        <el-select v-model="language" style="width: 90px" class="filter-item" @change="changeLanguage">
          <el-option v-for="item in allLanguages" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-checkbox v-model="testrun" style="margin-left: 20px" class="filter-item">
          测试运行
        </el-checkbox>
      </div>

      <textarea ref="editor" v-model="source" class="codesql" style="height:300px;width:600px;" />
      <!--      <el-form-item v-show="testrun" label="输入" style="margin-top: 12px ">-->
      <!--        <el-input v-model="input" type="textarea" :autosize="true" />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item v-show="testrun" label="输出" style="margin-top: 12px ">-->
      <!--        <el-input :value="output_text" type="textarea" :autosize="true" />-->
      <!--      </el-form-item>-->
      <!--      <el-button style="margin-top: 12px" type="primary" @click="submit">{{ submitBtnText }}</el-button>-->
      <!--      <el-button v-show="testrun" style="margin-top: 12px" type="primary" @click="submit1">测试运行</el-button>-->
      <!--      <el-button v-show="submitBtnText=='再次提交'" style="margin-top: 12px" type="success" @click="dialogVisible=true">查看上次运行结果</el-button>-->
    </el-form>

    <!--    <el-dialog-->
    <!--      title="运行状态"-->
    <!--      :visible.sync="dialogVisible"-->
    <!--      :show-close.sync="closeDlg"-->
    <!--      :close-on-click-modal.sync="closeDlg"-->
    <!--      :close-on-press-escape.sync="closeDlg"-->
    <!--      width="70%"-->
    <!--    >-->
    <!--      <span v-show="solution_id==0">{{ statusHint }}</span>-->
    <!--      <div v-show="solution_id!=0">-->
    <!--        <p>运行编号：{{ solution_id }}</p>-->
    <!--        <span v-show="status.result==0">正在获取运行结果。。。</span>-->
    <!--        <div v-show="status.result!=0">-->
    <!--          <p>运行结果：{{ status.result_name }}</p>-->
    <!--          <p>时间：{{ status.time }}</p>-->
    <!--          <p>内存：{{ status.memory }}</p>-->
    <!--          <p>判题机：{{ status.judger }}</p>-->
    <!--          <pre v-show="status.ce==true" v-html="ce" />-->
    <!--          <pre v-show="status.re==true" v-html="re" />-->
    <!--        </div>-->
    <!--      </div>-->

    <!--    </el-dialog>-->
    <!--    <el-dialog-->
    <!--      title="测试运行"-->
    <!--      :visible.sync="dialogVisible1"-->
    <!--      :show-close="false"-->
    <!--      :close-on-click-modal="false"-->
    <!--      :close-on-press-escape="false"-->
    <!--      width="30%"-->
    <!--    >-->
    <!--      正在获取运行结果，请耐心等待-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
// core
import * as CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/lib/codemirror.css'
// theme
import 'codemirror/theme/monokai.css'
// mode
import 'codemirror/mode/meta'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/python/python'
// addon
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/comment/continuecomment'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/display/autorefresh'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/search'

import { submitProblem, ajaxStatus, fetchRE, fetchCE } from '@/api/problem'

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
      allResults: [
        {
          value: '-1', label: '所有结果'
        }, {
          value: '4', label: '正确'
        }, {
          value: '5', label: '格式错误'
        }, {
          value: '6', label: '答案错误'
        }, {
          value: '7', label: '时间超限'
        }, {
          value: '8', label: '内存超限'
        }, {
          value: '9', label: '输出超限'
        }, {
          value: '10', label: '运行错误'
        }, {
          value: '11', label: '编译错误'
        }, {
          value: '0', label: '等待'
        }, {
          value: '1', label: '等待重判'
        }, {
          value: '2', label: '编译中'
        }, {
          value: '3', label: '运行并评判'
        }],
      language: '1',
      source: '',
      dialogVisible: false,
      dialogVisible1: false,
      editor: undefined,
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
      testrun: false,
      output_text: ''
    }
  },
  mounted() {
    console.log(CodeMirror.modeInfo)
    this.editor = CodeMirror.fromTextArea(this.$refs.editor, {
      placeholder: '请 输入代码 或 拖拽文件至此\n\n' +
        '部分快捷键\n' +
        '代码提示\t\t`\n' +
        '删除当前行\tCtrl-D\n' +
        '查找\t\tCtrl-F\n' +
        '查找下一个\tCtrl-G\n' +
        '查找上一个\tShift-Ctrl-G\n' +
        '替换\t\tShift-Ctrl-F(Mac:Cmd-Alt-F)\n' +
        '替换全部\t\tShift-Ctrl-R(Mac:Shift-Cmd-Alt-F)\n',
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
      extraKeys: { '`': 'autocomplete' },
      autoRefresh: true,
      showCursorWhenSelecting: true
    })
  },
  methods: {
    changeLanguage(language) {
      this.editor.setOption('mode', this.languageModeMap[language])
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
      submitProblem({ 'id': -this.submitData.id, 'source': this.editor.getValue(), 'input_text': this.input_text, 'language': this.submitData.language }).then(
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
        if (parseInt(this.status.result) < 4)setTimeout(this.getStatus, 2000)
        else {
          if (this.status.ce === true) {
            fetchCE(this.solution_id).then(response => {
              this.ce = response.data.detail
            })
          }
          if (this.status.re === true) {
            fetchRE(this.solution_id).then(response => {
              this.re = response.data.detail
            })
          }
          this.submitBtnText = '再次提交'
          this.closeDlg = true
          this.fetchData(this.submitData.id)
          this.$emit('ac')
        }
      }
      )
    },
    getStatus1() {
      ajaxStatus({ 'solution_id': this.solution_id1, 'tr': 1 }).then(response => {
        if (response.data.result === 0)setTimeout(this.getStatus1, 2000)
        else {
          this.output_text = response.data.error
          this.dialogVisible1 = false
        }
      }
      )
    }
  }
}
</script>
