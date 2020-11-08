<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="createContest">添加竞赛</el-button>
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
      <el-table-column label="竞赛编号" align="center" width="60px">
        <template slot-scope="scope">
          <p>{{ scope.row.id }}</p>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <p v-html="scope.row.title" />
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" width="160px">
        <template slot-scope="scope">
          {{ scope.row.startTime }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" width="160px">
        <template slot-scope="scope">
          {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.privateContest " type="danger">私有</el-tag>
          <el-tag v-else type="success">公有</el-tag>
          <el-tag v-if="scope.row.defunct===false" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="320">
        <template slot-scope="scope">
          <div>
            <el-button type="info" size="small" @click="editContest(scope.row.id)">
              编辑
            </el-button>
            <el-button
              v-if="scope.row.privateContest"
              type="success"
              size="small"
              icon="el-icon-key"
              @click="handleChangePrivate(scope.row.id)"
            >
              设为公开
            </el-button>
            <el-button
              v-else
              type="danger"
              size="small"
              icon="el-icon-lock"
              @click="handleChangePrivate(scope.row.id)"
            >
              设为私有
            </el-button>
            <el-button
              v-if="scope.row.defunct ===false"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleChangeStatus(scope.row.id)"
            >
              禁用
            </el-button>
            <el-button
              v-else
              type="success"
              size="small"
              icon="el-icon-delete"
              @click="handleChangeStatus(scope.row.id)"
            >
              启用
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :page-sizes="[50]"
      :limit="50"
      @pagination="getList"
    />
    <el-dialog
      title="创建/编辑竞赛"
      :visible.sync="dialogSendVisible"
      width="90%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      {{ postForm }}
      <el-form :model="postForm" label-position="left" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="postForm.title" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="postForm.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="postForm.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="私有">
              <el-switch
                v-model="postForm.privateContest"
                active-color="#ff4949"
                inactive-color="#dddddd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item v-if="postForm.privateContest" label="允许用户">
              <el-input v-model="postForm.users" type="textarea" placeholder="一行一个" autosize />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="postForm.privateContest" label="密码">
              <el-input v-model="postForm.password" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="题号">
              <el-input v-model="postForm.problemIds" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="语言">
              <el-select v-model="postForm.languages" multiple placeholder="可用语言" width="100%">
                <el-option
                  v-for="item in allLanguage"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <h4>描述</h4>
        <tinymce v-if="dialogSendVisible" v-model="postForm.description" height="200" style="margin-bottom: 20px" />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSendVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate"><span v-if="create">创建</span><span v-else>更新</span></el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { adminGetList, adminChangeStatus, adminChangePrivate, adminGetContest, adminAddContest, adminUpdateContest } from '../../api/contest'
import { getAllLanguages } from '@/api/language'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '../../components/Tinymce/index'

export default {
  name: 'ContestAdmin',
  directives: { waves },
  components: { Tinymce, Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 1,
      page: 1,
      keywords: undefined,
      listLoading: true,
      dialogSendVisible: false,
      postForm: { title: '' },
      create: true,
      allLanguage: []
    }
  },
  created() {
    this.getList()
    getAllLanguages().then(response => {
      this.allLanguage = response.data
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      adminGetList(this.page, this.keywords).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    createContest() {
      this.postForm = {
        description: '',
        endTime: '',
        language: [
          { value: 0, language: 'C' },
          { value: 1, language: 'C++' },
          { value: 2, language: 'Pascal' },
          { value: 3, language: 'Java' },
          { value: 4, language: 'Ruby' },
          { value: 5, language: 'Bash' },
          { value: 6, language: 'Python' },
          { value: 7, language: 'PHP' },
          { value: 8, language: 'Perl' },
          { value: 9, language: 'C#' },
          { value: 10, language: 'Obj-C' },
          { value: 11, language: 'FreeBasic' },
          { value: 12, language: 'Scheme' },
          { value: 13, language: 'Clang' },
          { value: 14, language: 'Clang++' },
          { value: 15, language: 'Lua' },
          { value: 16, language: 'JavaScript' },
          { value: 17, language: 'Go' },
          { value: 18, language: 'SQL(sqlite3)' }
        ],
        language_selected: [0, 1],
        password: '',
        plist: '',
        private: false,
        startTime: '',
        title: '',
        ulist: ''
      }
      this.create = true
      this.dialogSendVisible = true
    },
    handleChangeStatus(id) {
      this.listLoading = true
      adminChangeStatus(id).then(() => {
        this.getList()
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleChangePrivate(id) {
      this.listLoading = true
      adminChangePrivate(id).then(() => {
        this.getList()
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCreate() {
      if (this.create) {
        adminAddContest(this.postForm).then(() => {
          this.$message({ 'type': 'success', 'message': '添加成功' })
          this.getList()
          this.dialogSendVisible = false
        })
      } else {
        adminUpdateContest(this.postForm).then(() => {
          this.$message({ 'type': 'success', 'message': '编辑成功' })
          this.getList()
          this.dialogSendVisible = false
        })
      }
    },
    editContest(id) {
      adminGetContest(id).then(response => {
        this.postForm = response.data
        this.create = false
        this.dialogSendVisible = true
      })
    }
  }
}
</script>
<style scoped>
</style>
