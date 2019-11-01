<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tooltip placement="bottom" content="提示: 搜索用户时会显示总榜">
        <el-input v-model="listQuery.prefix" placeholder="搜索用户" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      </el-tooltip>
      <el-select
        v-model="listQuery.scope"
        placeholder="范围"
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >

      <el-table-column label="排名" align="center" width="50px">
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
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          <router-link :to="'/profile/user/'+scope.row.user_id" class="link-type">
            {{ scope.row.nick }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="正确" align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.row.solved }}
        </template>
      </el-table-column>
      <el-table-column label="提交" align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.row.submit }}
        </template>
      </el-table-column>
      <el-table-column label="比率" align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.row.rate }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :page-sizes="[50]" :limit="50" @pagination="getList" />

  </div>
</template>

<script>
import { fetchRanklist } from '@/api/problem'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Ranklist',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listQuery: {
        scope: '',
        start: 1,
        prefix: undefined
      },
      total: 0,
      listLoading: true,
      options: [
        { label: '总榜', value: '' },
        { label: '日榜', value: 'd' },
        { label: '周榜', value: 'w' },
        { label: '月榜', value: 'm' },
        { label: '年榜', value: 'y' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.listQuery.prefix !== undefined && this.listQuery.prefix.length > 0) this.listQuery.scope = ''
      this.listLoading = true
      fetchRanklist(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
<style scoped>
</style>
