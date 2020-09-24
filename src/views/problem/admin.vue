<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="createProblem">添加问题</el-button>
      <el-popover
        placement="bottom"
        title="提示"
        width="200"
        trigger="hover"
        content="如要搜索题号，输入'id:题号'，例如'id:1001'"
      >
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
          <p>{{ scope.row.id }}</p>
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
          {{ scope.row.inDate }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.defunct" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="320px">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="editProblem(scope.row.id)">
            编辑
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-tickets" @click="getDetail(scope.row.id)">
            查看详情
          </el-button>
          <el-button v-if="!scope.row.defunct" type="danger" size="small" icon="el-icon-delete" @click="handleChange(scope.row.id)">
            禁用
          </el-button>
          <el-button v-else type="success" size="small" icon="el-icon-delete" @click="handleChange(scope.row.id)">
            启用
          </el-button>
        </template>
      </el-table-column>
      <el-table-column width="80px">
        <template slot-scope="scope">
          <router-link v-if="scope.row.manageData" :to="'/problem/data/'+scope.row.id" class="link-type">
            <el-button type="success" size="small">
              数据
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :page-sizes="[20,30,50,100]"
      :limit.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @pagination="getList"
    />
    <el-dialog
      title="问题详情"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <h2>{{ detail.id }}. {{ detail.title }} <span v-if="detail.spj" style="color: red">SPJ</span></h2>
      <p>时间限制 / 空间限制 / 来源： {{ detail.timeLimit }}S / {{ detail.memoryLimit }}MB / {{ detail.source }}</p>
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
          <pre v-text="detail.sampleInput" />
        </el-col>
        <el-col :span="12">
          <h3 style="color: royalblue">样例输出</h3>
          <pre v-text="detail.sampleOutput" />
        </el-col>
      </el-row>
      <h3 style="color: royalblue">提示</h3>
      <div v-html="detail.hint" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="创建/编辑问题"
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
        <el-row v-if="create" :gutter="20">
          <el-col :span="12">
            <h3>测试输入</h3>
            <el-input v-model="postForm.test_input" type="textarea" :rows="10" />
          </el-col>
          <el-col :span="12">
            <h3>测试输出</h3>
            <el-input v-model="postForm.test_output" type="textarea" :rows="10" />
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
import { adminGetList, adminChangeStatus, adminGetProblem, adminUpdate, adminAdd } from '../../api/problem'
import waves from '@/directive/waves' // waves directive
import Tinymce from '../../components/Tinymce/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ProblemAdmin',
  directives: { waves },
  components: { Tinymce, Pagination },
  data() {
    return {
      tableKey: 0,
      currentPage: 1,
      pageSize: 100,
      keywords: '',
      total: 0,
      list: null,
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
      adminGetList(this.currentPage, this.pageSize, this.keywords).then(response => {
        this.list = response.data.list
        this.total = response.data.total
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
      this.postForm = {
        description: '',
        hint: '',
        input: '',
        memory_limit: 128,
        output: '',
        sample_input: '',
        sample_output: '',
        source: '',
        spj: false,
        time_limit: 1,
        title: ''
      }
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
        adminAdd(this.postForm).then(() => {
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
