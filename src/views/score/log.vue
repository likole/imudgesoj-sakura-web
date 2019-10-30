<template>
  <div class="app-container">
    <h3>目前积分：{{ score }}</h3>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="score_log"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="时间" align="center" width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原因" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分值变动" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { fetchList } from '@/api/score'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ScoreLog',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      score_log: null,
      score: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList().then(response => {
        this.score_log = response.data.score_log
        this.score = response.data.score
      })
    }
  }
}
</script>

<style scoped>

</style>
