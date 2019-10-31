<template>
  <div class="app-container">
    <div v-if="cid===0">
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="getContests">
          刷新
        </el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="contests"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="编号" align="center" width="100px">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.private===1" icon-class="password" />
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="getProblems(scope.row.id)" v-html="scope.row.title" />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="250px">
          <template slot-scope="scope">
            <p v-html="scope.row.time" />
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center" width="250px">
          <template slot-scope="scope">
            {{ scope.row.creator }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="cid!==0">
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-back" @click="getContests">
          返回竞赛列表
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="getProblems(cid)">
          刷新
        </el-button>
      </div>
      <h2 align="center">{{ cid }} - <span v-html="contest.title" /></h2>
      <div v-html="contest.description" />
      <p>开始时间: {{ contest.start }}</p>
      <p>结束时间: {{ contest.end }}</p>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="contest.problemset"
        border
        fit
        highlight-current-row
        :row-class-name="tableRowClassName"
        style="width: 100%;"
      >
        <el-table-column label="" align="center" width="80px">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.status=='Y'" type="success">Y</el-tag>
            <el-tag v-show="scope.row.status=='N'" type="danger">N</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" width="150px">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center" width="">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="来源" align="center" width="200px">
          <template slot-scope="scope">
            {{ scope.row.source }}
          </template>
        </el-table-column>
        <el-table-column label="解决" align="center" width="80px">
          <template slot-scope="scope">
            {{ scope.row.ac }}
          </template>
        </el-table-column>
        <el-table-column label="提交" align="center" width="80px">
          <template slot-scope="scope">
            {{ scope.row.submit }}
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import { fetchContests, fetchProblems } from '@/api/contest'
import waves from '@/directive/waves' // waves directive
import Cookies from 'js-cookie'

export default {
  name: 'ContestList',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      contests: null,
      contest: null,
      listLoading: true,
      cid: 0
    }
  },
  created() {
    if (Cookies.get('cid') !== undefined && Cookies.get('cid') !== '0') { this.getProblems(parseInt(Cookies.get('cid'))) } else { this.getContests() }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 'Y') {
        return 'success-row'
      } else if (row.result === 'N') {
        return 'fail-row'
      }
      return ''
    },
    getContests() {
      this.cid = 0
      this.contest = null
      Cookies.set('cid', this.cid, { expires: 1 })
      this.listLoading = true
      document.title = `竞赛`
      fetchContests().then(response => {
        this.contests = response.data
        this.listLoading = false
      })
    },
    getProblems(cid) {
      this.cid = cid
      this.contest = null
      Cookies.set('cid', this.cid, { expires: 1 })
      this.listLoading = true
      fetchProblems(cid).then(response => {
        this.contest = response.data
        document.title = `竞赛 - ${this.cid} - ${this.contest.title}`
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        this.cid = 0
      })
    }
  }
}
</script>
<style scoped>
  .fail-row {
    color: darkred;
    background: oldlace;
  }

  .success-row {
    color: darkgreen;
    background: greenyellow;
  }
</style>
