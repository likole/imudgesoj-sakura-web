<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tooltip placement="bottom" content="提示: 搜索用户时会显示总榜">
        <el-input v-model="listQuery.username" placeholder="搜索用户" :style="device==='desktop'?'width:200px':'width:100%'" class="filter-item" :size="device==='desktop'?'medium':'mini'" @keyup.enter.native="getList" />
      </el-tooltip>
      <el-select
        v-model="listQuery.type"
        placeholder="范围"
        :style="device==='desktop'?'width:200px':'width:100%'"
        class="filter-item"
        :size="device==='desktop'?'medium':'mini'"
        @change="handleFilter"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-if="device==='mobile'" type="primary" icon="el-icon-search" style="width: 100%;" size="mini" @click="getList">
        搜索
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
      :size="device==='desktop'?'medium':'mini'"
    >

      <el-table-column label="排名" align="center" width="70px">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (listQuery.page-1)*50 }}
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" width="200px">
        <template slot-scope="scope">
          <router-link :to="'/profile/user/'+scope.row.userId" class="link-type">
            {{ scope.row.userId }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" min-width="200px">
        <template slot-scope="scope">
          <router-link :to="'/profile/user/'+scope.row.userId" class="link-type">
            {{ scope.row.nick }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="正确" align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.row.solved }}
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.type===0" label="提交" align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.row.submit }}
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.type===0" label="比率" align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.row.submit !== 0 ? parseInt(scope.row.solved * 100000 / scope.row.submit) / 1000 : 0 }}%
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :page-sizes="[50]"
      :limit="50"
      :layout="device==='desktop'?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      :small="device==='mobile'"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { fetchRanklist } from '@/api/problem'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapState } from 'vuex'

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
        type: 0,
        page: 1,
        username: undefined
      },
      total: 0,
      listLoading: true,
      options: [
        { label: '总榜', value: 0 },
        { label: '学期榜', value: 1 },
        { label: '月榜', value: 2 },
        { label: '日榜', value: 3 }
      ]
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
      if (this.listQuery.username !== undefined && this.listQuery.username.length > 0) this.listQuery.type = 0
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
