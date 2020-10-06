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
            <span>{{ scope.row.solution_id_text }}</span>
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
            <div v-if="scope.row.show"><a style="color: blue" @click="showSource(scope.row.solution_id)">{{ scope.row.language }}</a></div>
            <span v-else>{{ scope.row.language }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代码长度" align="center" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.length }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" align="center" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.in_date }}</span>
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
        :auto-scroll="false"
        @pagination="getList"
      />

    </el-card>

    <el-dialog
      title="查看源码"
      :visible.sync="sourceDialogVisible"
      width="70%"
    >
      <pre>{{ source }}</pre>
      <el-button type="primary" @click="handleCopy(source,$event)">复制</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { fetchProblemStatusDetail, fetchSource } from '@/api/problem'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard'
import { mapState } from 'vuex'

export default {
  name: 'ProblemStatusDetailComponent',
  components: { Pagination },
  props: {
    pid: {
      required: true,
      type: Number
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
      total: 0,
      sourceDialogVisible: false,
      source: ''
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
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
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    showSource(id) {
      this.source = ''
      fetchSource(id).then(response => {
        this.source = response.data
        this.sourceDialogVisible = true
      })
    }
  }
}
</script>
