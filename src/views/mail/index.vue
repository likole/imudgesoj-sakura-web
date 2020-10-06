<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" :size="device==='desktop'?'medium':'mini'" @click="sendEmail('')">发送</el-button>
      <el-button type="primary" icon="el-icon-refresh" :size="device==='desktop'?'medium':'mini'" @click="getList">刷新</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :size="device==='desktop'?'medium':'mini'"
    >
      <el-table-column label="" align="center" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.newMail">新消息</el-tag>
          <span v-else>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" min-width="200px">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" :width="device==='desktop'?'200px':'150px'">
        <template slot-scope="scope">
          <router-link :to="'/profile/user/'+scope.row.fromUser" class="link-type">
            {{ scope.row.fromUser }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" :width="device==='desktop'?'180px':'140px'">
        <template slot-scope="scope">
          {{ scope.row.inDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="success" :size="device==='desktop'?'small':'mini'" icon="el-icon-tickets" @click="scope.row.newMail=false;getDetail(scope.row.id)">
            查看详情
          </el-button>
          <el-button type="primary" :size="device==='desktop'?'small':'mini'" icon="el-icon-delete" @click="sendEmail(scope.row.fromUser)">
            回信
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="消息"
      :visible.sync="dialogVisible"
      :width="device==='desktop'?'70%':'95%'"
    >
      <h2>{{ detail.title }}</h2>
      <p style="color: royalblue">FROM: {{ detail.fromUser }}</p>
      <div>{{ detail.content }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="发送消息"
      :visible.sync="dialogSendVisible"
      :width="device==='desktop'?'70%':'95%'"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form v-if="device==='desktop'" :model="postForm" label-position="left" label-width="70px" style="margin:0 50px;">
        <el-form-item label="对方账号">
          <el-input v-model="postForm.toUser" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="postForm.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="postForm.content" type="textarea" :autosize="true" row="5" />
        </el-form-item>
      </el-form>
      <el-form v-else :model="postForm" style="margin:0 10px;" size="mini">
        <el-form-item label="对方账号">
          <el-input v-model="postForm.toUser" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="postForm.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="postForm.content" type="textarea" :autosize="true" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSendVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSend">发送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { postMail, fetchMail, fetchMailList } from '@/api/mail.js'
import waves from '@/directive/waves' // waves directive
import { mapState } from 'vuex'

export default {
  name: 'MailIndex',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      dialogVisible: false,
      dialogSendVisible: false,
      detail: {},
      postForm: {}
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchMailList().then(response => {
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getDetail(id) {
      fetchMail(id).then(response => {
        this.detail = response.data
        this.dialogVisible = true
      })
    },
    sendEmail(id) {
      this.postForm = { toUser: id }
      this.dialogSendVisible = true
    },
    handleSend() {
      postMail(this.postForm).then(() => {
        this.$message({ 'type': 'success', 'message': '发送成功' })
        this.getList()
        this.dialogSendVisible = false
      })
    }
  }
}
</script>
<style scoped>
</style>
