<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-switch
          v-model="listQuery.acceptedExam"
          active-text="过滤笔试通过人员"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-switch
          v-model="listQuery.acceptedInterview"
          active-text="过滤面试通过人员"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button v-loading="downloadLoading" type="primary" @click="handleDownload">导出该页信息</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="search" placeholder="当前页搜索，姓名或学号" style="width: 300px" />
      </el-form-item>
    </el-form>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list.filter(data => !search || (data.userInfo&&data.userInfo.name.includes(search)) || (data.userInfo&&data.userInfo.studentId.includes(search)))"
      border
      fit
      highlight-current-row
      :cell-style="{padding:'3px'}"
    >
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="手机" align="center" width="120px">
        <template slot-scope="scope">
          {{ scope.row.userInfo && scope.row.userInfo.phone1 }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          {{ scope.row.userInfo && scope.row.userInfo.email1 }}
        </template>
      </el-table-column>
      <el-table-column label="QQ" align="center" width="120px">
        <template slot-scope="scope">
          {{ scope.row.userInfo && scope.row.userInfo.qq }}
        </template>
      </el-table-column>
      <el-table-column label="年级" align="center" width="70px">
        <template slot-scope="scope">
          {{ scope.row.userInfo && scope.row.userInfo.grade }}
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center" width="150px">
        <template slot-scope="scope">
          {{ scope.row.userInfo.classroomName }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" width="60px">
        <template slot-scope="scope">
          {{ scope.row.userInfo && (scope.row.userInfo.gender === 0 ? '男' : scope.row.user.gender === 1 ? '女' : '其他') }}
        </template>
      </el-table-column>
      <el-table-column label="学号" align="center" width="120px">
        <template slot-scope="scope">
          <b>{{ scope.row.userInfo && scope.row.userInfo.studentId }}</b>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="90px">
        <template slot-scope="scope">
          <b>{{ scope.row.userInfo && scope.row.userInfo.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="报名志愿" align="center" width="90px">
        <template slot-scope="scope">
          {{
            scope.row.firstWish && options[scope.row.firstWish - 1].label
          }}{{
            scope.row.secondWish && options[scope.row.secondWish - 1].label
          }}{{ scope.row.thirdWish && options[scope.row.thirdWish - 1].label }}
        </template>
      </el-table-column>
      <el-table-column label="个人介绍" align="center" width="90px" type="expand">
        <template slot-scope="scope">
          <div>{{ scope.row.introduction }}</div>
        </template>
      </el-table-column>
      <el-table-column label="笔试" align="center" width="160px">
        <template slot-scope="scope">
          <div v-if="scope.row.acceptedExam">
            <span style="color: forestgreen">已通过</span>
            <el-button v-if="scope.row.acceptedInterview==null" type="warning" size="small" @click="updateStatus(scope.row.username,1,0)">撤回</el-button>
          </div>
          <div v-else-if="scope.row.acceptedExam===false">
            <span style="color: orangered">未通过</span>
            <el-button type="warning" size="small" @click="updateStatus(scope.row.username,1,0)">撤回</el-button>
          </div>
          <div v-else>
            <el-button type="success" size="small" @click="updateStatus(scope.row.username,1,1)">通过</el-button>
            <el-button type="danger" size="small" @click="updateStatus(scope.row.username,1,-1)">拒绝</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="面试分组" align="center" width="90px">
        <template slot-scope="scope">
          <b>{{ scope.row.interviewGroup != null ? (scope.row.interviewGroup + 1) : '' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="面试" align="center" width="160px">
        <template v-if="scope.row.acceptedExam&&scope.row.interviewGroup!=null" slot-scope="scope">
          <div v-if="scope.row.acceptedInterview">
            <span style="color: forestgreen">已通过</span>
            <el-button type="warning" size="small" @click="updateStatus(scope.row.username, 2,0)">撤回</el-button>
          </div>
          <div v-else-if="scope.row.acceptedInterview===false">
            <span style="color: orangered">未通过</span>
            <el-button type="warning" size="small" @click="updateStatus(scope.row.username,2,0)">撤回</el-button>
          </div>
          <div v-else>
            <el-button type="success" size="small" @click="updateStatus(scope.row.username,2,1)">通过</el-button>
            <el-button type="danger" size="small" @click="updateStatus(scope.row.username,2,-1)">拒绝</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :page-sizes="[20,50,100,200,500]"
      :limit.sync="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { getRecruitList, updateRecruitStatus } from '@/api/imudges'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'RecruitAdmin',
  components: { Pagination },
  data() {
    return {
      tableKey: 1,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 50,
        acceptedExam: false,
        acceptedInterview: false
      },
      options: [
        { label: '前后', value: 1 },
        { label: '移', value: 2 },
        { label: '机', value: 3 },
        { label: '游', value: 4 },
        { label: '', value: 5 },
        { label: '', value: 6 }
      ],
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
      search: '',
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRecruitList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].userInfo.classroom === undefined) continue
          const index = this.classroomOptions.findIndex(item => item.value === this.list[i].userInfo.classroom)
          if (index >= 0) {
            this.list[i].userInfo.classroomName = this.classroomOptions[index].label
          }
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    updateStatus(username, id1, id2) {
      this.listLoading = true
      updateRecruitStatus(username, id1, id2).then(response => {
        this.getList()
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '用户名',
          '学号',
          '姓名',
          '性别',
          '年级',
          '班级',
          '手机1',
          '邮箱1',
          'QQ',
          '第一志愿',
          '第二志愿',
          '第三志愿',
          '个人介绍',
          '是否已报名',
          '是否已通过笔试',
          '面试分组',
          '是否已通过面试',
          '最终分组',
          '创建时间',
          '报名信息更新时间',
          '说明\n' +
          '性别：0男 1女\n' +
          '志愿：1前端后端组 2移动开发组 3机器学习组 4游戏组'
        ]
        const data = this.formatJson([
          'username',
          '.studentId',
          '.name',
          '.gender',
          '.grade',
          '.classroomName',
          '.phone1',
          '.email1',
          '.qq',
          'firstWish',
          'secondWish',
          'thirdWish',
          'introduction',
          'hasEnrolled',
          'acceptedExam',
          'interviewGroup',
          'acceptedInterview',
          'finalGroup',
          'infoCreateTime',
          'infoUpdateTime'
        ], this.list)
        const d = new Date()
        const filename = '报名信息导出_' + (
          d.getMonth() +
          1 +
          '月' +
          d.getDate() +
          '日' +
          d.getHours() +
          '时' +
          d.getMinutes() +
          '分')
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename
        })
        this.$notify({
          type: 'warning',
          title: '当前页面信息导出成功',
          message: '注意导出内容仅包含当前页面数据，如需导出所有数据，请先调大页面大小~',
          duration: 10000
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j[0] === '.') {
          if (v.userInfo != null) {
            return v.userInfo[j.replace('.', '')]
          } else {
            return null
          }
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
