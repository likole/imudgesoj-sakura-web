<template>
  <div class="app-container">
    <h3>目前积分：{{ totalScore }}</h3>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :size="device==='desktop'?'medium':'mini'"
    >
      <el-table-column label="时间" align="center" :width="device==='desktop'?'250px':'170px'">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原因" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分值变动" align="center" :width="device==='desktop'?'150px':'80px'">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :page-sizes="[20,30,50]"
      :limit.sync="pageSize"
      :layout="device==='desktop'?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      :small="device==='mobile'"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { fetchList } from '@/api/score'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapState } from 'vuex'
import { getTotalScore } from '@/api/score'
export default {
  name: 'ScoreLog',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      score: 0,
      page: 1,
      pageSize: 20,
      list: null,
      total: 0,
      totalScore: undefined
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getTotalScore().then(response => {
        this.totalScore = response.data
      })
      fetchList(this.page, this.pageSize).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.score = response.data.score
      })
    }
  }
}
</script>

<style scoped>

</style>
