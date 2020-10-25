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
      <el-select v-model="username" filterable placeholder="请选择" @change="getInfo">
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
            {{ info.recruit.firstWish && groupOptions[info.recruit.firstWish-1].label }}
            {{ info.recruit.secondWish && groupOptions[info.recruit.secondWish-1].label }}
            {{ info.recruit.thirdWish && groupOptions[info.recruit.thirdWish-1].label }}
            <p style="color: royalblue">刷题信息</p>
            <div v-html="info.abstract" />
          </el-card>
        </el-col>
      </el-row>
      <!-- end main -->
    </div>
  </div>
</template>
<script>
import { getInterviewList, getInterviewDetail } from '@/api/imudges'

export default {
  name: 'ImudgesRecruitInterview',
  data() {
    return {
      interviewGroup: 1,
      interviewServer: 'http://127.0.0.1',
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
      ]
    }
  },
  methods: {
    start() {
      getInterviewList(this.interviewGroup - 1).then(response => {
        this.options = response.data
        this.started = true
      })
    },
    getInfo() {
      getInterviewDetail(this.username).then(response => {
        this.info = response.data
        if (this.info.classroom !== undefined) {
          const index = this.classroomOptions.findIndex(item => item.value === this.info.classroom)
          if (index >= 0) { this.info.classroomName = this.classroomOptions[index].label }
        }
      })
    }
  }
}
</script>
