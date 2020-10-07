<template>
  <div>
    <div v-if="toUser!==name">
      <el-button v-if="status===false" :loading="loading" size="mini" type="primary" icon="el-icon-star-off" @click="follow">关注</el-button>
      <el-button v-if="status===true" :loading="loading" size="mini" type="warning" icon="el-icon-star-on" @click="unfollow">取消关注</el-button>
    </div>
  </div>
</template>
<script>
import { checkFollowingStatus, followUser, unfollowUser } from '@/api/following'
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
      status: undefined
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
    }
  }
}
</script>
