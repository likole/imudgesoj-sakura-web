<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="search" :style="device==='desktop'?'width:200px':'width:100%'" class="filter-item" :size="device==='desktop'?'medium':'mini'" @keyup.enter.native="getList" />
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
      <el-table-column label="UserID(Username)" align="center" width="150px">
        <template slot-scope="scope">
          <p>{{ scope.row.userId }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Nickname" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.nick }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Phone" align="center" width="110px">
        <template slot-scope="scope">
          <p>{{ scope.row.loginUser&&scope.row.loginUser.phone }}</p>
        </template>
      </el-table-column>
      <el-table-column label="StudentId" align="center" width="110px">
        <template slot-scope="scope">
          <p>{{ scope.row.userInfo&& scope.row.userInfo.studentId }} </p>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center" width="110px">
        <template slot-scope="scope">
          <p> {{ scope.row.userInfo&& scope.row.userInfo.name }} </p>
        </template>
      </el-table-column>
      <el-table-column label="AC/SUBMIT" align="center" width="110px">
        <template slot-scope="scope">
          <p>{{ scope.row.solved }}/{{ scope.row.submit }}</p>
        </template>
      </el-table-column>
      <el-table-column label="ACTIONS" align="center" width="300px">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="changePassword(scope.row.userId)">
            CHG PWD
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :page-sizes="[10,20,30,50,100]"
      :limit.sync="listQuery.limit"
      :layout="device==='desktop'?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      :small="device==='mobile'"
      @pagination="getList"
    />

    <!--start change password-->
    <el-dialog
      title="CHANGE PASSWORD"
      :visible.sync="dialogChangeVisible"
      width="70%"
    >
      <el-form :model="changePasswordForm">
        <el-form-item label="UserId (Username)">
          <el-input :value="changePasswordForm.username" disabled />
        </el-form-item>
        <el-form-item>
          <el-input v-model="changePasswordForm.password" placeholder="New Password" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleChangePassword">Change</el-button>
      </span>
    </el-dialog>
    <!--end change password-->
  </div>
</template>

<script>
import { getUserList, forceChangePassword } from '../../api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapState } from 'vuex'

export default {
  name: 'UserAdmin',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: ''
      },
      total: 0,
      dialogChangeVisible: false,
      changePasswordForm: {
        username: '',
        password: ''
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    changePassword(username) {
      this.changePasswordForm = {
        username: username,
        password: ''
      }
      this.dialogChangeVisible = true
    },
    handleChangePassword() {
      forceChangePassword(this.changePasswordForm).then(response => {
        this.dialogChangeVisible = false
      })
    }
  }
}
</script>
<style scoped>
</style>
