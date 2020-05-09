<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-if="device==='desktop'">
        <el-input v-model="pid" type="number" placeholder="输入题号按回车直接跳转" style="width: 200px;" class="filter-item" @keyup.enter.native="handleDirect" />
        <el-tooltip placement="bottom" content="多关键词以空格分隔">
          <el-input v-model="listQuery.search" placeholder="标题，来源，描述" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-tooltip>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-checkbox v-model="showCategory" class="filter-item" style="margin-left:15px;" @change="handleCategory">
          显示分类
        </el-checkbox>
        <el-button v-waves class="filter-item" type="primary" @click="showAllCategory">
          查看所有分类
        </el-button>
      </div>
      <div v-else>
        <el-input v-model="listQuery.search" placeholder="标题，来源，描述。多关键词以空格分隔" style="width: 100%" class="filter-item" size="mini" @keyup.enter.native="handleFilter" />
        <br>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="width: 100%;" size="mini" @click="handleFilter">
          搜索
        </el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      :row-class-name="tableRowClassName"
      style="width: 100%;"
      :size="device==='desktop'?'medium':'mini'"
    >

      <el-table-column label="" align="center" :width="device==='desktop'?'80px':'28px'">
        <template slot-scope="scope">
          <div v-if="device==='desktop'">
            <el-tag v-show="scope.row.result=='Y'" type="success">Y</el-tag>
            <el-tag v-show="scope.row.result=='N'" type="danger">N</el-tag>
          </div>
          <div v-else>
            <p v-show="scope.row.result=='Y'" style="color: green">Y</p>
            <p v-show="scope.row.result=='N'" style="color: red">N</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="device==='desktop'?'题目编号':'ID'" sortable prop="id" align="center" :width="device==='desktop'?'150px':'60px'">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" min-width="200px">
        <template slot-scope="scope">
          <router-link :to="'/problem/submit/'+scope.row.id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column v-if="showCategory" width="200px" label="分类" align="center">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.category" :key="index" @click="searchCategory(item)">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="正确率" :sortable="true" :sort-method="sortMethod" :width="device==='desktop'?'200px':'100px'" align="center">
        <template slot-scope="scope">
          <el-progress :show-text="false" :percentage="scope.row.submit==0?0:(scope.row.ac /scope.row.submit*100)" />
          <span>{{ scope.row.ac }}/{{ scope.row.submit }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :page-sizes="[10,20,30,50,100]"
      :limit.sync="listQuery.limit"
      :layout="device==='desktop'?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      :small="device==='mobile'"
      @pagination="getList"
    />

    <el-dialog
      title="所有分类"
      :visible.sync="categoryDialogVisible"
      width="70%"
    >
      <el-tag v-for="(item,index) in categories" :key="index" :type="item.color" style="margin:5px 10px" @click="searchCategory(item.category)">{{ item.category }}</el-tag>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchCategories } from '@/api/problem'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

export default {
  name: 'ProblemList',
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
        limit: 20,
        search: undefined
      },
      showCategory: false,
      pid: undefined,
      categoryDialogVisible: false,
      categories: null
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  created() {
    if (Cookies.get('page') !== undefined) this.listQuery.page = parseInt(Cookies.get('page'))
    if (Cookies.get('limit') !== undefined) this.listQuery.limit = parseInt(Cookies.get('limit'))
    if (Cookies.get('showCategory') !== undefined) this.showCategory = Cookies.get('showCategory') === 'true'
    this.getList()
  },
  activated() {
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
      Cookies.set('page', this.listQuery.page, { expires: 30 })
      Cookies.set('limit', this.listQuery.limit, { expires: 30 })
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
    searchCategory(category) {
      this.listQuery.search = category
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
    },
    handleCategory() {
      this.tableKey = this.tableKey + 1
      Cookies.set('showCategory', this.showCategory)
    },
    handleDirect() {
      if (this.pid !== undefined) { this.$router.push('/problem/submit/' + this.pid) }
    },
    showAllCategory() {
      if (this.categories == null) {
        fetchCategories().then(response => {
          this.categories = response.data
        })
      }
      this.categoryDialogVisible = true
    }
  }
}
</script>
<style>
  .fail-row {
    color: darkred;
    background: oldlace;
  }

  .success-row {
    color: darkgreen;
    background: greenyellow;
  }
</style>
