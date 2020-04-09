<template>
  <div class="app-container">
    <el-alert style="margin-bottom: 20px">暂不支持测试数据的管理，即将上线</el-alert>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="createProblem">添加问题</el-button>
      <el-select v-model="currentPage" class="filter-item" placeholder="页码" @change="getList">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        />
      </el-select>
      <el-popover
        placement="bottom"
        title="提示"
        width="200"
        trigger="hover"
        content="指定关键词时，分页将失效">
        <el-input slot="reference" v-model="keywords" placeholder="关键词" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      </el-popover>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
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
    >
      <el-table-column label="问题编号" align="center" width="80px">
        <template slot-scope="scope">
          <p>{{ scope.row.problem_id }}</p>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="AC" align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.row.accepted }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center" width="220px">
        <template slot-scope="scope">
          {{ scope.row.in_date }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status ==='N'" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="320">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="editProblem(scope.row.problem_id)">
            编辑
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-tickets" @click="getDetail(scope.row.problem_id)">
            查看详情
          </el-button>
          <el-button v-if="scope.row.status ==='N'" type="danger" size="small" icon="el-icon-delete" @click="handleChange(scope.row.problem_id)">
            禁用
          </el-button>
          <el-button v-else type="success" size="small" icon="el-icon-delete" @click="handleChange(scope.row.problem_id)">
            启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="问题详情"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <h2>{{ detail.problem_id }}. {{ detail.title }} <span v-if="detail.spj" style="color: red">SPJ</span></h2>
      <p>时间限制 / 空间限制 / 来源： {{ detail.time_limit }}S / {{ detail.memory_limit }}MB / {{ detail.source }}</p>
      <h3 style="color: royalblue">描述</h3>
      <div v-html="detail.description" />
      <el-row :gutter="20">
        <el-col :span="12">
          <h3 style="color: royalblue">输入</h3>
          <div v-html="detail.input" />
        </el-col>
        <el-col :span="12">
          <h3 style="color: royalblue">输出</h3>
          <div v-html="detail.output" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <h3 style="color: royalblue">样例输入</h3>
          <pre v-text="detail.sample_input" />
        </el-col>
        <el-col :span="12">
          <h3 style="color: royalblue">样例输出</h3>
          <pre v-text="detail.sample_output" />
        </el-col>
      </el-row>
      <h3 style="color: royalblue">提示</h3>
      <div v-html="detail.hint" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑问题"
      :visible.sync="dialogSendVisible"
      width="70%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form :model="postForm" label-position="left" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input v-model="postForm.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源">
              <el-input v-model="postForm.source" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="时间限制">
              <el-input v-model="postForm.time_limit">
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="空间限制">
              <el-input v-model="postForm.memory_limit">
                <template slot="append">兆字节</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SPJ">
              <el-switch
                v-model="postForm.spj"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <h3>描述</h3>
        <tinymce v-if="dialogSendVisible" v-model="postForm.description" height="400" />
        <h3>输入</h3>
        <tinymce v-if="dialogSendVisible" v-model="postForm.input" height="200" />
        <h3>输出</h3>
        <tinymce v-if="dialogSendVisible" v-model="postForm.output" height="200" />
        <el-row :gutter="20">
          <el-col :span="12">
            <h3>样例输入</h3>
            <el-input v-model="postForm.sample_input" type="textarea" :rows="10" />
          </el-col>
          <el-col :span="12">
            <h3>样例输出</h3>
            <el-input v-model="postForm.sample_output" type="textarea" :rows="10" />
          </el-col>
        </el-row>
        <h3>提示</h3>
        <tinymce v-if="dialogSendVisible" v-model="postForm.hint" height="200" />
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
import { adminGetList, adminChangeStatus, adminGetProblem, adminUpdate } from '../../api/problem'
import waves from '@/directive/waves' // waves directive
import Tinymce from '../../components/Tinymce/index'

export default {
  name: 'ProblemAdmin',
  directives: { waves },
  components: { Tinymce },
  data() {
    return {
      tableKey: 0,
      list: null,
      options: [],
      currentPage: undefined,
      keywords: undefined,
      listLoading: true,
      dialogVisible: false,
      dialogSendVisible: false,
      detail: {},
      postForm: { title: '' },
      create: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      adminGetList(this.currentPage,this.keywords).then(response => {
        this.list = response.data.items
        this.options = response.data.options
        this.currentPage = response.data.page
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getDetail(id) {
      adminGetProblem(id).then(response => {
        this.detail = response.data
        this.dialogVisible = true
      })
    },
    createProblem() {
      this.postForm = { }
      this.create = true
      this.dialogSendVisible = true
    },
    handleChange(id) {
      this.listLoading = true
      adminChangeStatus(id).then(() => {
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
        adminUpdate(this.postForm).then(() => {
          this.$message({ 'type': 'success', 'message': '编辑成功' })
          this.getList()
          this.dialogSendVisible = false
        })
      }
    },
    editProblem(id) {
      adminGetProblem(id).then(response => {
        this.postForm = response.data
        this.postForm.problem_id = id
        this.create = false
        this.dialogSendVisible = true
      })
    }
  }
}
</script>
<style scoped>
</style>
