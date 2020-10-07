<template>
  <div>
    <div v-if="toUser!==name">
      <el-button v-if="status===false" :loading="loading" size="mini" type="primary" icon="el-icon-star-off" @click="follow">关注</el-button>
      <el-button v-if="status===true" :loading="loading" size="mini" type="warning" icon="el-icon-star-on" @click="unfollow">取消关注</el-button>
      <el-button size="mini" icon="el-icon-tickets" @click="getList">我的关注列表</el-button>
    </div>
    <el-dialog
      title="我的关注列表"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div v-if="list.length===0">无关注</div>
      <div v-else>
        <li v-for="(item,index) in list" :key="index">
          {{ item.toUsername }} <el-button type="text" @click="unfollowInDialog(item.toUsername)">取消关注</el-button>
        </li>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { checkFollowingStatus, followUser, unfollowUser, fetchFollowingList } from '@/api/following'
import { mapGetters } from 'vuex'

export default {
  props: {
    toUser: {
      type: String,
      default: '',
      loading: false
    }
  },
  data() {
    return {
      status: undefined,
      dialogVisible: false,
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'name' // self username
    ])
  },
  created() {
    this.checkStatus()
  },
  methods: {
    checkStatus() {
      if (this.name !== this.toUser) {
        checkFollowingStatus(this.toUser).then(response => {
          this.status = response.data
        })
      }
    },
    follow() {
      this.loading = true
      followUser(this.toUser).then(() => {
        this.checkStatus()
        this.loading = false
      })
    },
    unfollow() {
      this.loading = true
      unfollowUser(this.toUser).then(() => {
        this.checkStatus()
        this.loading = false
      })
    },
    getList() {
      fetchFollowingList().then(response => {
        this.list = response.data
        this.dialogVisible = true
      })
    },
    unfollowInDialog(user) {
      unfollowUser(user).then(() => {
        this.getList()
      })
    }
  }
}
</script>
