<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="page" class="filter-item" placeholder="页码" @change="getList">
        <el-option
          v-for="item in total"
          :key="item"
          :label="'第 '+item+' 页'"
          :value="item"
        />
      </el-select>
      <!--          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="createProblem">添加问题</el-button>-->
      <!--          <el-popover-->
      <!--            placement="bottom"-->
      <!--            title="提示"-->
      <!--            width="200"-->
      <!--            trigger="hover"-->
      <!--            content="指定关键词时，分页将失效"-->
      <!--          >-->
      <!--            <el-input slot="reference" v-model="keywords" placeholder="关键词" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />-->
      <!--          </el-popover>-->
      <!--          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">-->
      <!--            搜索-->
      <!--          </el-button>-->
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
          <p>{{ scope.row.contest_id }}</p>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <p v-html="scope.row.title" />
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" width="160px">
        <template slot-scope="scope">
          {{ scope.row.start_time }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" width="160px">
        <template slot-scope="scope">
          {{ scope.row.end_time }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.private " type="danger">私有</el-tag>
          <el-tag v-else type="success">公有</el-tag>
          <el-tag v-if="scope.row.status ==='N'" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="320">
        <template slot-scope="scope">
          <div v-if="scope.row.privilege">
            <el-button type="info" size="small" @click="editContest(scope.row.contest_id)">
              编辑
            </el-button>
            <el-button
              v-if="scope.row.private"
              type="success"
              size="small"
              icon="el-icon-key"
              @click="handleChangePrivate(scope.row.contest_id)"
            >
              设为公开
            </el-button>
            <el-button
              v-else
              type="danger"
              size="small"
              icon="el-icon-lock"
              @click="handleChangePrivate(scope.row.contest_id)"
            >
              设为私有
            </el-button>
            <el-button
              v-if="scope.row.status ==='N'"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleChangeStatus(scope.row.contest_id)"
            >
              禁用
            </el-button>
            <el-button
              v-else
              type="success"
              size="small"
              icon="el-icon-delete"
              @click="handleChangeStatus(scope.row.contest_id)"
            >
              启用
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="创建/编辑竞赛"
      :visible.sync="dialogSendVisible"
      width="70%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form :model="postForm" label-position="left" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="postForm.title" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
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
          <el-col :span="12">
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
          <el-col :span="12">
            <el-form-item label="私有">
              <el-switch
                v-model="postForm.private"
                active-color="#ff4949"
                inactive-color="#dddddd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码">
              <el-input v-model="postForm.password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="题号">
              <el-input v-model="postForm.plist" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="语言">
              <el-select v-model="postForm.language_selected" multiple placeholder="可用语言" width="100%">
                <el-option
                  v-for="item in postForm.language"
                  :key="item.value"
                  :label="item.language"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <h4>描述</h4>
        <tinymce v-if="dialogSendVisible" v-model="postForm.description" height="200" style="margin-bottom: 20px" />
        <el-form-item v-if="postForm.private" label="允许用户">
          <el-input type="textarea" :rows="10" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSendVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate"><span v-if="create">创建</span><span v-else>更新</span></el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { adminUpdate, adminAdd } from '../../api/problem'
import { adminGetList, adminChangeStatus, adminChangePrivate, adminGetContest } from '../../api/contest'
import waves from '@/directive/waves' // waves directive
import Tinymce from '../../components/Tinymce/index'

export default {
  name: 'ContestAdmin',
  directives: { waves },
  components: { Tinymce },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 1,
      page: undefined,
      options: [],
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
      adminGetList(this.page).then(response => {
        this.list = response.data.contests
        this.total = response.data.total
        this.page = response.data.page
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
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
    editContest(id) {
      adminGetContest(id).then(response => {
        this.postForm = response.data
        this.postForm.contest_id = id
        this.create = false
        this.dialogSendVisible = true
      })
    }
  }
}
</script>
<style scoped>
</style>
