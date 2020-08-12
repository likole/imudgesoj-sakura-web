<template>
  <div>
    <el-alert style="margin-bottom: 10px">自动登录的历史不会显示在这儿</el-alert>
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
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.time }}
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center">
        <template slot-scope="scope">
          {{ scope.row.ip }} ( {{ scope.row.location }} )
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1||scope.row.status===5" style="color: darkred">登录失败（密码错误）</span>
          <span v-else style="color: green">登录成功</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :page-sizes="[10]"
      :limit="10"
      :layout="device==='desktop'?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      :small="device==='mobile'"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getLoginLog, getSelfLoginLog } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapState } from 'vuex'

export default {
  components: { Pagination },
  directives: { waves },
  props: {
    me: {
      type: Boolean,
      default: true
    },
    username: {
      type: String,
      default: ''
    }
  },
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
      if (this.me) {
        getSelfLoginLog(this.page).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      } else {
        getLoginLog(this.username, this.page).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      }
    }
  }
}
</script>
