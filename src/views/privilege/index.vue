<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="createNews">添加新闻</el-button>
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
      <el-table-column label="新闻编号" align="center" width="80px">
        <template slot-scope="scope">
          <p>{{ scope.row.news_id }}</p>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="200px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.defunct ==='N'" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" width="180px">
        <template slot-scope="scope">
          {{ scope.row.time }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="320">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="editNews(scope.row.news_id)">
            编辑
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-tickets" @click="getDetail(scope.row.news_id)">
            查看详情
          </el-button>
          <el-button v-if="scope.row.defunct ==='N'" type="danger" size="small" icon="el-icon-delete" @click="handleChange(scope.row.news_id)">
            禁用
          </el-button>
          <el-button v-else type="success" size="small" icon="el-icon-delete" @click="handleChange(scope.row.news_id)">
            启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新闻详情"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <h2>{{ detail.title }}</h2>
      <div v-html="detail.content" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑新闻"
      :visible.sync="dialogSendVisible"
      width="70%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form :model="postForm">
        <el-form-item label="标题">
          <el-input v-model="postForm.title" />
        </el-form-item>
        <tinymce v-if="dialogSendVisible" v-model="postForm.content" height="400" />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSendVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate"><span v-if="create">创建</span><span v-else>更新</span></el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getNewsList, getNews, changeNewsStatus, addNews, editNews } from '../../api/news'
import waves from '@/directive/waves' // waves directive
import Tinymce from '../../components/Tinymce/index'

export default {
  name: 'PrivilegeIndex',
  directives: { waves },
  components: { Tinymce },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      dialogVisible: false,
      dialogSendVisible: false,
      detail: {},
      postForm: { title: '', content: '' },
      create: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getNewsList().then(response => {
        this.list = response.data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getDetail(id) {
      getNews(id).then(response => {
        this.detail = response.data
        this.dialogVisible = true
      })
    },
    createNews() {
      this.postForm = { }
      this.create = true
      this.dialogSendVisible = true
    },
    handleChange(id) {
      this.listLoading = true
      changeNewsStatus(id).then(() => {
        this.getList()
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCreate() {
      if (this.create) {
        addNews(this.postForm).then(() => {
          this.$message({ 'type': 'success', 'message': '添加成功' })
          this.getList()
          this.dialogSendVisible = false
        })
      } else {
        editNews(this.postForm).then(() => {
          this.$message({ 'type': 'success', 'message': '编辑成功' })
          this.getList()
          this.dialogSendVisible = false
        })
      }
    },
    editNews(id) {
      getNews(id).then(response => {
        this.postForm = response.data
        this.postForm.news_id = id
        this.create = false
        this.dialogSendVisible = true
      })
    }
  }
}
</script>
<style scoped>
</style>
