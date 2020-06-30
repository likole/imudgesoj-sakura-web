<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="createPrivilege">添加</el-button>
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
      <el-table-column label="用户" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.user_id }}</p>
        </template>
      </el-table-column>
      <el-table-column label="权限" align="center">
        <template slot-scope="scope">
          {{ scope.row.rightstr }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.row.user_id,scope.row.rightstr)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加权限"
      :visible.sync="dialogSendVisible"
      width="70%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form :model="postForm">
        <el-form-item label="用户">
          <el-input v-model="postForm.user_id" />
        </el-form-item>
        <el-form-item>
          <el-radio v-model="postForm.type" label="0">系统角色</el-radio>
          <el-radio v-model="postForm.type" label="1">竞赛</el-radio>
        </el-form-item>
        <el-form-item>
          <el-select v-if="postForm.type==='0'" v-model="postForm.rightstr" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-else v-model="postForm.rightstr_tmp" placeholder="竞赛编号" type="number" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSendVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPrivilegeList, deletePrivilege, addPrivilege } from '../../api/privilege'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'UserPrivilege',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      dialogSendVisible: false,
      options: [],
      postForm: { user_id: '', rightstr: '', type: '0' }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getPrivilegeList().then(response => {
        this.list = response.data.items
        this.options = response.data.options
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    createPrivilege() {
      this.postForm = { user_id: '', rightstr: '', type: '0', rightstr_tmp: '' }
      this.dialogSendVisible = true
    },
    handleCreate() {
      if (this.postForm.type === '1') {
        this.postForm.rightstr = 'c' + this.postForm.rightstr_tmp
      }
      addPrivilege(this.postForm).then(() => {
        this.$message({ 'type': 'success', 'message': '添加成功' })
        this.getList()
        this.dialogSendVisible = false
      })
    },
    handleDelete(user_id, rightstr) {
      deletePrivilege(user_id, rightstr).then(() => {
        this.$message({ 'type': 'success', 'message': '删除成功' })
        this.getList()
      })
    }
  }
}
</script>
<style scoped>
</style>
