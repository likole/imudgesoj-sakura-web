<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
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
          还没写
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" width="60px">
        <template slot-scope="scope">
          {{ scope.row.userInfo && (scope.row.userInfo.gender===0?'男':scope.row.user.gender===1?'女':'其他') }}
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
          {{ scope.row.firstWish && options[scope.row.firstWish-1].label }}{{ scope.row.secondWish && options[scope.row.secondWish-1].label }}{{ scope.row.thirdWish && options[scope.row.thirdWish-1].label }}
        </template>
      </el-table-column>
      <el-table-column label="笔试" align="center" width="160px">
        <template slot-scope="scope">
          <div v-if="scope.row.acceptedExam">
            <span style="color: forestgreen">已通过</span>
            <el-button type="warning" size="small" @click="updateStatus(scope.row.username,1,0)">撤回</el-button>
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
      <el-table-column label="面试" align="center" width="160px">
        <template slot-scope="scope">
          <div v-if="scope.row.acceptedExam">
            <span v-if="scope.row.acceptedInterview" style="color: forestgreen">已通过</span>
            <span v-if="scope.row.acceptedInterview===false" style="color: orangered">未通过</span>
            <el-button type="success" size="small">通过</el-button>
            <el-button type="danger" size="small">拒绝</el-button>
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
  name: 'ImudgesRecruitAdmin',
  components: { Pagination },
  data() {
    return {
      tableKey: 1,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 50
      },
      options: [
        { label: '前', value: 1 },
        { label: '后', value: 2 },
        { label: '移', value: 3 },
        { label: '游', value: 4 },
        { label: '创', value: 5 },
        { label: '机', value: 6 }
      ]
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
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    updateStatus(username, id1, id2) {
      updateRecruitStatus(username, id1, id2).then(response => {
        this.getList()
      })
    }
  }
}
</script>
