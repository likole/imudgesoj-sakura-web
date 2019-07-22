<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      <el-input v-model="listQuery.problem_id" placeholder="题目编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
      <!--      <el-input v-model="listQuery.user_id" placeholder="用户编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
      <!--      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">-->
      <!--        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
      <!--      </el-select>-->
      <!--      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">-->
      <!--        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
      <!--      </el-select>-->
      <!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--      </el-select>-->
      <!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
      <!--        Search-->
      <!--      </el-button>-->
      <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
      <!--        Add-->
      <!--      </el-button>-->
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--        Export-->
      <!--      </el-button>-->
      <!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--        reviewer-->
      <!--      </el-checkbox>-->
    </div>

    <el-button-group style="margin: 20px 0">
      <el-button type="primary" icon="el-icon-d-arrow-left" @click="firstPage">首页</el-button>
      <el-button type="primary" icon="el-icon-arrow-left" @click="prevPage">上一页</el-button>
      <el-button type="primary" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
    </el-button-group>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="运行编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.solution_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题" align="center">
        <template slot-scope="scope">
          <router-link v-show="scope.row.problem_id!='0'" :to="'/problem/submit/'+scope.row.problem_id" class="link-type">
            <span>{{ scope.row.problem_id }}</span>
          </router-link>
          <span v-show="scope.row.problem_id=='0'">{{ scope.row.problem_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结果" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.result.code|statusFilter">{{ scope.row.result.msg }}</el-tag>
          <el-tag v-show="scope.row.result.sim_s_id!=undefined" >{{ scope.row.result.sim_s_id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="内存" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="语言" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.language }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码长度" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code_length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.in_data| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="判题机" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.judger }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-button-group style="margin: 20px 0">
      <el-button type="primary" icon="el-icon-d-arrow-left" @click="firstPage">首页</el-button>
      <el-button type="primary" icon="el-icon-arrow-left" @click="prevPage">上一页</el-button>
      <el-button type="primary" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
    </el-button-group>
  </div>
</template>

<script>
import { fetchStatus } from '@/api/problem'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

export default {
  name: 'ProblemStatus',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        top: -1,
        bottom: 0
      },
      dialogFormVisible: false,
      downloadLoading: false
    }
  },
  filters:{
    statusFilter(status) {
      const statusMap = {
        '0': 'info',
        '1': '',
        '2': 'warning',
        '3': 'warning',
        '4': 'success',
        '5': 'danger',
        '6': 'danger',
        '7': 'warning',
        '8': 'warning',
        '9': 'warning',
        '10': 'warning',
        '11': 'warning',
        '12': 'warning',
        '13': ''
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchStatus(this.listQuery).then(response => {
        this.list = response.data.item
        this.listQuery.top = response.data.top
        this.listQuery.bottom = response.data.bottom
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.top = -1
      this.getList()
    },
    firstPage() {
      this.listQuery.top = -1
      this.getList()
    },
    prevPage() {
      this.listQuery.top = parseInt(this.listQuery.top) + 20
      this.getList()
    },
    nextPage() {
      this.listQuery.top = this.listQuery.bottom
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
