<template>
  <div class="app-container">
    <el-alert type="error" style="margin-bottom: 20px;">改动数据后不会立即在判题机上生效，数据每5分钟同步一次，请耐心等待~
      （本来打算写实时同步，但是要用到消息队列，服务器配置能省一点是一点= =）</el-alert>
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card style="margin-bottom: 20px">
          <div class="filter-container">
            <el-button class="filter-item" type="primary" icon="el-icon-plus" style="width: 100%" @click="showAddDialog">添加测试数据</el-button>
          </div>
          <el-table
            v-loading="listLoading"
            :data="dataIdList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="测试数据组名" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleChange(scope.row)">查看</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card v-if="dataId!=null">
          <el-form>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="dataId+'.in'">
                  <el-button type="text" size="mini" @click="handleCopy(input,$event)">复制</el-button>
                  <el-input v-model="input" type="textarea" :autosize="true" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="dataId+'.out'">
                  <el-button type="text" size="mini" @click="handleCopy(output,$event)">复制</el-button>
                  <el-input v-model="output" type="textarea" :autosize="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button v-loading="listLoading" type="primary" @click="handleUpdate">更新测试数据</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="添加测试数据"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="70%"
    >
      <el-form>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="输入">
              <el-input v-model="newInput" type="textarea" :autosize="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="输出">
              <el-input v-model="newOutput" type="textarea" :autosize="true" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-button type="default" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import { getDataIds, getData, updateData, deleteData, addData } from '../../api/data'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'ProblemData',
  directives: { waves },
  data() {
    return {
      problemId: null,
      tempRoute: {},
      dataId: null,
      dataIdList: null,
      listLoading: true,
      input: '',
      output: '',
      dialogVisible: false,
      newInput: '',
      newOutput: ''
    }
  },
  created() {
    this.problemId = this.$route.params && parseInt(this.$route.params.id)
    this.tempRoute = Object.assign({}, this.$route)
    this.setTagsViewTitle()
    this.setPageTitle()
    this.getList()
  },
  methods: {
    setTagsViewTitle() {
      const title = '数据管理'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-题号${this.problemId}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '数据管理'
      document.title = `${title} - 题号${this.problemId}`
    },
    getList() {
      this.listLoading = true
      getDataIds(this.problemId).then(response => {
        this.dataIdList = response.data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 切换测试数据组
    handleChange(dataId) {
      this.dataId = dataId
      getData(this.problemId, this.dataId).then(response => {
        this.input = response.data.input
        this.output = response.data.output
      })
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    handleUpdate() {
      this.listLoading = true
      updateData(this.problemId, this.dataId, this.input, this.output).then(() => {
        this.$notify({
          title: '更新成功',
          message: '测试数据已更新成功',
          type: 'success',
          duration: 2000
        })
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleDelete(dataId) {
      this.listLoading = true
      deleteData(this.problemId, dataId).then(() => {
        this.$notify({
          title: '删除成功',
          message: '测试数据已删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      }).catch(() => {
        this.listLoading = false
      })
    },
    showAddDialog() {
      this.dialogVisible = true
    },
    handleAdd() {
      this.listLoading = true
      addData(this.problemId, this.newInput, this.newOutput).then(response => {
        this.$notify({
          title: '添加成功',
          message: '新测试数据组名为： ' + response.data,
          type: 'success',
          duration: 2000
        })
        this.dialogVisible = false
        this.getList()
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
