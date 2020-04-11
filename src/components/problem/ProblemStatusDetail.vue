<template>
  <div>
    <el-card v-if="total>0" v-loading="listLoading" style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>AC用户排行榜</span>
      </div>

      <el-table
        v-loading="listLoading"
        :data="solution"
        fit
        stripe
        size="mini"
        highlight-current-row
        style="width: 100%;"
      >

        <el-table-column label="排名" prop="id" align="center" width="70px">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运行编号" align="center" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.solution_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内存" align="center" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.memory }}</span>
          </template>
        </el-table-column>
        <el-table-column label="耗时" align="center" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="语言" align="center" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.language }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代码长度" align="center" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.length }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.in_date }}</span>
          </template>
        </el-table-column>
<!--        <el-table-column label="标题" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <router-link :to="'/problem/submit/'+scope.row.id" class="link-type">-->
<!--              <span>{{ scope.row.title }}</span>-->
<!--            </router-link>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column v-if="showCategory" width="200px" label="分类" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-tag v-for="(item,index) in scope.row.category" :key="index" @click="searchCategory(item)">{{ item }}</el-tag>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="正确率" :sortable="true" :sort-method="sortMethod" width="200px" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-progress :show-text="false" :percentage="scope.row.submit==0?0:(scope.row.ac /scope.row.submit*100)" />-->
<!--            <span>{{ scope.row.ac }}/{{ scope.row.submit }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="page" :page-sizes="[20]" :limit="20" :auto-scroll="false" @pagination="getList" />

    </el-card>
  </div>
</template>

<script>
import { fetchProblemStatusDetail } from '@/api/problem'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ProblemStatusDetailComponent',
  components: { Pagination },
  props: {
    pid: {
      required: true,
      type: String
    },
    idForUpdate: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      solution: {},
      listLoading: false,
      page: 1,
      total: 0
    }
  },
  watch: {
    idForUpdate: {
      deep: true,
      handler(val) {
        this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchProblemStatusDetail(this.pid, this.page).then(response => {
        this.total = response.data.total
        this.solution = response.data.solution
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
