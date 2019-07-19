<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="标题，来源，描述" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-checkbox v-model="showCategory" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        显示分类
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      height
      highlight-current-row
      :row-class-name="tableRowClassName"
      style="width: 100%;"
    >
      <el-table-column label="题目编号" sortable prop="id" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <router-link :to="'/problems/submit/'+scope.row.id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column v-if="showCategory" label="分类" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="正确率" :sortable="true" :sort-method="sortMethod" width="200px" align="center">
        <template slot-scope="scope">
          <el-progress :show-text="false" :percentage="scope.row.submit==0?0:(scope.row.ac /scope.row.submit*100)" />
          <span>{{ scope.row.ac }}/{{ scope.row.submit }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList } from '@/api/problems'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Cookies from 'js-cookie'

export default {
  name: 'ProblemsList',
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
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 100,
        search: undefined
      },
      showCategory: false
    }
  },
  created() {
    if (Cookies.get('page') !== undefined) this.listQuery.page = parseInt(Cookies.get('page'))
    this.getList()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.result === 'Y') {
        return 'success-row'
      } else if (row.result === 'N') {
        return 'fail-row'
      }
      return ''
    },
    getList() {
      Cookies.set('page', this.listQuery.page)
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortMethod(obj1, obj2) {
      // eslint-disable-next-line eqeqeq
      const tmp1 = obj1.submit == 0 ? 0 : (obj1.ac / obj1.submit)
      // eslint-disable-next-line eqeqeq
      const tmp2 = obj2.submit == 0 ? 0 : (obj2.ac / obj2.submit)
      if (tmp1 < tmp2) return -1
      return 1
    }
  }
}
</script>
<style scoped>
  .el-table .fail-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
