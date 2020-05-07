<template>
  <div class="app-container">
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
      <el-table-column label="排名" align="center" width="70px">
        <template slot-scope="scope">
          {{ scope.row.rank }}
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" width="200px">
        <template slot-scope="scope">
          <router-link :to="'/profile/user/'+scope.row.user_id" class="link-type">
            {{ scope.row.user_id }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" min-width="200px">
        <template slot-scope="scope">
          <router-link :to="'/profile/user/'+scope.row.user_id" class="link-type">
            {{ scope.row.nick }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.row.score }}
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :page-sizes="[50]"
      :limit="50"
      :layout="device==='desktop'?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      :small="device==='mobile'"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { scoreRanklist } from '../../api/score'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapState } from 'vuex'

export default {
  name: 'RanklistScore',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      page: 1,
      list: null,
      total: 0,
      listLoading: true
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
      this.listLoading = true
      scoreRanklist(this.page).then(response => {
        this.list = response.data.ranklist
        this.total = response.data.count
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped>
</style>
