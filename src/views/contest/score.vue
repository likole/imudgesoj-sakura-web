<template>
  <div class="app-container">
    <el-alert type="error" style="margin-top: 20px" :closable="false">竞赛范围请勿选择过大，否则你的浏览器可能会卡死</el-alert>
    <div class="filter-container" style="margin-top: 20px">
      <el-input
        v-model="contestIds"
        placeholder="竞赛编号，例如 1001,1003-1005"
        style="width: 300px;margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleSearch"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        查询
      </el-button>
      <el-button v-if="list.length" v-loading="downloadLoading" v-waves class="filter-item" type="success" icon="el-icon-download" @click="handleDownload">
        下载
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      size="mini"
      max-height="800px"
      :default-sort="{prop: 'total', order: 'descending'}"
    >
      <el-table-column label="用户编号" sortable :sort-method="sortByUserId" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总计" prop="total" sortable :sort-method="sortByTotal" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row['-1'] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in ids" :key="index" :label="item+''" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row[item+''] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { fetchContestScores } from '../../api/java_contest'

export default {
  name: 'ContestScore',
  directives: { waves },
  data() {
    return {
      contestIds: '',
      tableKey: 0,
      ids: [],
      list: [],
      listLoading: false,
      downloadLoading: false
    }
  },
  methods: {
    handleSearch() {
      this.listLoading = true
      fetchContestScores(this.contestIds).then(response => {
        this.ids = response.data.ids
        for (const key in response.data.scores) {
          response.data.scores[key]['user_id'] = key
        }
        this.list = Object.values(response.data.scores)
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    sortByUserId(obj1, obj2) {
      if (obj1['user_id'] < obj2['user_id']) return -1
      return 1
    },
    sortByTotal(obj1, obj2) {
      if (obj1['-1'] < obj2['-1']) return -1
      return 1
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户', '总计'].concat(this.ids)
        const filterVal = ['user_id', '-1'].concat(this.ids)
        const data = this.formatJson(filterVal, this.list)
        const d = new Date()
        const filename = '竞赛结果导出_' + this.contestIds + '_' + (
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
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
