<template>
  <div>
    <div class="filter-container">
      <router-link to="/article/create">
        <el-button class="filter-item" type="primary" icon="el-icon-plus">创建新文章</el-button>
      </router-link>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="getList">刷新列表</el-button>
    </div>
    <!-- 开始文章列表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="编号" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100px">
        <template slot-scope="scope">
          <span :style="'color:'+statusColor[scope.row.status]">{{ statusMap[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="80px">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" size="small">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :page-sizes="[20]"
      :limit="20"
      :layout="device==='desktop'?'total, prev, pager, next, jumper':'prev, pager, next'"
      :small="device==='mobile'"
      @pagination="getList"
    />
    <!-- 结束文章列表 -->
  </div>
</template>

<script>
import { getSelfArticleList } from '@/api/article'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapState } from 'vuex'
export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      total: 0,
      page: 1,
      list: null,
      listLoading: true,
      statusMap: {
        0: '草稿',
        1: '等待审核',
        2: '审核通过',
        3: '审核通过',
        4: '审核未通过'
      },
      statusColor: {
        0: '#b0b0b0',
        1: 'darkorange',
        2: 'darkgreen',
        3: 'darkgreen',
        4: 'darkred'
      }
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
      getSelfArticleList(this.page).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
