<template>
  <div class="app-container">
    <el-form v-if="!started" :inline="true">
      <el-form-item label="面试组别">
        <el-input v-model="interviewGroup" type="number" min="1" />
      </el-form-item>
      <el-form-item label="面试服务器地址">
        <el-input v-model="interviewServer" type="text" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="start">开始面试</el-button>
      </el-form-item>
    </el-form>
    <div v-else>
      <el-select v-model="username" filterable placeholder="请选择用户" @change="getInfo">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- start main -->
      <el-row v-if="info" :gutter="20" style="margin-top: 20px">
        <el-col :md="12">
          <el-card>
            <p style="color: royalblue">基本信息</p>
            {{ info.studentId }} {{ info.name }} {{ info.grade }}{{ info.classroomName }}
            <p style="color: royalblue">报名信息</p>
            {{ info.recruit && info.recruit.firstWish && groupOptions[info.recruit.firstWish - 1].label }}
            {{ info.recruit && info.recruit.secondWish && groupOptions[info.recruit.secondWish - 1].label }}
            {{ info.recruit && info.recruit.thirdWish && groupOptions[info.recruit.thirdWish - 1].label }}
            <hr/>
            {{ info.recruit && info.recruit.introduction }}
            <p style="color: royalblue">刷题概要信息</p>
            <div v-html="info.abstract" />
            <p style="color: royalblue">参加的竞赛</p>
            <el-tag v-for="(item,index) in info.contestIds" :key="index" style="margin: 3px">{{ item }}</el-tag>
            <p style="color: royalblue">查重结果（排除1001）</p>
            <el-tag v-for="(item,index) in info.sim100" :key="index" type="danger" style="margin: 3px;cursor: pointer">
              <router-link :to="'/problem/submit/'+item">
                {{ item }}
              </router-link>
            </el-tag>
            <el-table
              :data="info.sim"
              border
              fit
              highlight-current-row
              :cell-style="{padding:'1px'}"
              style="margin-top: 10px"
            >
              <el-table-column label="运行编号" align="center">
                <template slot-scope="scope">
                  {{ scope.row.selfId }}
                </template>
              </el-table-column>
              <el-table-column label="对方运行编号" align="center">
                <template slot-scope="scope">
                  {{ scope.row.otherId }}
                </template>
              </el-table-column>
              <el-table-column label="题目编号" align="center">
                <template slot-scope="scope">
                  <router-link :to="'/problem/submit/'+scope.row.problemId" class="link-type">
                    {{ scope.row.problemId }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="相似度" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.similarity===100" style="color: red">{{ scope.row.similarity }}%</span>
                  <span v-else>{{ scope.row.similarity }}%</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :md="12">
          <el-card>
            <el-form>
              <el-form-item>
                <el-select
                  v-model="note.tag"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  style="width: 100%"
                  placeholder="添加标签/关键词"
                >
                  <el-option label="题数要求" value="题数要求" />
                  <el-option label="编程题" value="编程题" />
                  <el-option label="查重" value="查重" />
                  <el-option label="高数" value="高数" />
                  <el-option label="特长" value="特长" />
                  <el-option label="更多标签请自行输入" value="更多标签请自行输入" disabled />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-radio-group v-model="note.type">
                  <el-radio-button label="差评" />
                  <el-radio-button label="无感情色彩" />
                  <el-radio-button label="好评" />
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-input v-model="note.content" type="textarea" :autosize="true" placeholder="在此输入您的评价/笔记等内容..." />
              </el-form-item>
            </el-form>
            <el-alert v-if="!serverConnected" type="error" title="服务器连接失败" :closable="false" show-icon>无法连接面试服务器，不能进行评价等操作</el-alert>
            <el-button v-else type="success" @click="publish">对该用户进行评论</el-button>
          </el-card>
          <el-card style="margin-top: 20px">
            <span slot="header">所有评论</span>
            <div v-for="(item,index) in noteList" v-if="item.interviewee===username" :key="index" style="margin-bottom: 5px">
              <span style="color: royalblue;font-weight: bold">{{ item.interviewer }} - {{ timestampToTime(item.time) }}</span><br>
              <el-tag v-for="(tag,innerIndex) in item.tag" :key="innerIndex" size="mini"> {{ tag }}</el-tag>
              <span v-if="item.type==='差评'" style="color: red" v-html="item.content" />
              <span v-else-if="item.type==='好评'" style="color: green" v-html="item.content" />
              <span v-else v-html="item.content" />
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- end main -->
    </div>
  </div>
</template>
<script>
import { getInterviewList, getInterviewDetail } from '@/api/imudges'
import { getToken } from '@/utils/auth'
import io from 'socket.io-client'

export default {
  name: 'ImudgesRecruitInterview',
  data() {
    return {
      interviewGroup: 1,
      interviewServer: 'ws://127.0.0.1:10001',
      socket: undefined,
      started: false,
      options: [],
      username: '',
      info: undefined,
      classroomOptions: [
        {
          'label': '计科',
          'value': 10101,
          'children': null
        },
        {
          'label': '网工',
          'value': 10102,
          'children': null
        },
        {
          'label': '信管',
          'value': 10103,
          'children': null
        },
        {
          'label': '电商',
          'value': 10104,
          'children': null
        },
        {
          'label': '大数据',
          'value': 10105,
          'children': null
        },
        {
          'label': '软一',
          'value': 10106,
          'children': null
        },
        {
          'label': '软二',
          'value': 10107,
          'children': null
        },
        {
          'label': '电信',
          'value': 10201,
          'children': null
        },
        {
          'label': '通信',
          'value': 10202,
          'children': null
        },
        {
          'label': '自动化',
          'value': 10203,
          'children': null
        },
        {
          'label': '电院其他',
          'value': 10204,
          'children': null
        },
        {
          'label': '应用数学',
          'value': 10301,
          'children': null
        },
        {
          'label': '计算科学',
          'value': 10302,
          'children': null
        },
        {
          'label': '统计学',
          'value': 10303,
          'children': null
        },
        {
          'label': '数院其他',
          'value': 10304,
          'children': null
        },
        {
          'label': '经济学',
          'value': 10401,
          'children': null
        },
        {
          'label': '金融学',
          'value': 10402,
          'children': null
        },
        {
          'label': '金融工程',
          'value': 10403,
          'children': null
        },
        {
          'label': '管理科学',
          'value': 10404,
          'children': null
        },
        {
          'label': '人力资源管理',
          'value': 10405,
          'children': null
        },
        {
          'label': '市场营销',
          'value': 10406,
          'children': null
        },
        {
          'label': '工商管理',
          'value': 10407,
          'children': null
        },
        {
          'label': '会计学',
          'value': 10408,
          'children': null
        },
        {
          'label': '财务管理',
          'value': 10409,
          'children': null
        },
        {
          'label': '经管院其他',
          'value': 10410,
          'children': null
        },
        {
          'label': '新闻学',
          'value': 10501,
          'children': null
        },
        {
          'label': '编辑出版学',
          'value': 10503,
          'children': null
        },
        {
          'label': '播音主持',
          'value': 10503,
          'children': null
        },
        {
          'label': '文新院其他',
          'value': 10504,
          'children': null
        },
        {
          'label': '外院',
          'value': 106,
          'children': null
        },
        {
          'label': '物院',
          'value': 107,
          'children': null
        },
        {
          'label': '化院',
          'value': 108,
          'children': null
        },
        {
          'label': '生科院',
          'value': 109,
          'children': null
        },
        {
          'label': '生环',
          'value': 110,
          'children': null
        },
        {
          'label': '其他',
          'value': 111,
          'children': null
        }
      ],
      groupOptions: [
        { label: '前端后端组', value: 1 },
        { label: '移动开发组', value: 2 },
        { label: '机器学习组', value: 3 },
        { label: '游戏组', value: 4 }
      ],
      note: {
        content: '',
        type: '无感情色彩',
        tag: []
      },
      noteList: [],
      serverConnected: false
    }
  },
  methods: {
    start() {
      getInterviewList(this.interviewGroup - 1).then(response => {
        this.options = response.data
        this.started = true
      })
      this.socket = io(this.interviewServer, {
        query: `group=${this.interviewGroup}&token=` + getToken(),
        transports: ['websocket'],
        upgrade: false
      })
      this.socket.on('message', data => {
        this.$message(data)
      })
      this.socket.on('note', data => {
        this.noteList.unshift(data)
      })
      this.socket.on('init', data => {
        this.noteList = data
        this.serverConnected = true
      })
    },
    getInfo() {
      getInterviewDetail(this.username).then(response => {
        this.info = response.data
        if (this.info.classroom !== undefined) {
          const index = this.classroomOptions.findIndex(item => item.value === this.info.classroom)
          if (index >= 0) {
            this.info.classroomName = this.classroomOptions[index].label
          }
        }
      })
    },
    publish() {
      this.note.interviewee = this.username
      this.socket.emit('note', this.note, () => {
        this.note = {
          content: '',
          type: '无感情色彩',
          tag: []
        }
      })
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return Y + M + D + h + m + s
    }
  }
}
</script>
