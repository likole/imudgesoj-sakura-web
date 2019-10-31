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
      <div align="center" v-html="contest.description" />
      <div style="margin-top: 20px">
        <el-progress :percentage="progress" :show-text="false" />
        <p style="float: left">开始时间: {{ contest.start }}</p>
        <p style="float: right">结束时间: {{ contest.end }}</p>
      </div>
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
      cid: 0,
      progress: 0
    }
  },
  created() {
    if (Cookies.get('cid') !== undefined && Cookies.get('cid') !== '0') { this.getProblems(parseInt(Cookies.get('cid'))) } else { this.getContests() }
    this.computeProgress()
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
      fetchContests().then(response => {
        this.contests = response.data
        this.listLoading = false
      })
    },
    getProblems(cid) {
      this.listLoading = true
      fetchProblems(cid).then(response => {
        this.contest = response.data
        Cookies.set('cid', this.cid, { expires: 1 })
        this.cid = cid
        this.listLoading = false
      }).catch(() => {
        this.getContests()
      })
    },
    computeProgress() {
      if (this.contest != null) {
        const t1 = new Date(this.contest.start)
        const t2 = new Date(this.contest.end)
        const now = new Date()
        if (now <= t1) this.progress = 0
        else if (now >= t2) this.progress = 100
        else this.progress = (t2 - now) / (now - t1)
      }
      setTimeout(this.computeProgress, 1000)
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
