<template>
  <div class="app-container">
    <el-card v-if="recruit" style="margin-bottom: 20px">
      <el-steps :active="recruit.step" finish-status="success" align-center>
        <el-step title="完善个人信息" />
        <el-step title="提交报名信息" />
        <el-step title="笔试" />
        <el-step title="面试" />
      </el-steps>
    </el-card>
    <el-card v-if="recruit">
      <div v-if="recruit.step===0">
        <p>
          请在 <router-link to="/profile/index" style="color: royalblue">个人中心</router-link>  中完善个人的 基本信息 和 联系信息
        </p>
        {{ userinfo }}
        <p>{{ userinfo.name }}</p>
        <p>{{ userinfo.studentId }}</p>
        <p>{{ userinfo.gender }}</p>
        <p>{{ userinfo.qq }}</p>
        <p>{{ userinfo.phone1 }}</p>
        <p>{{ userinfo.email1 }}</p>
        <p>
          请不要在招新尚未完成之前随意删除个人信息，以免联系不到
        </p>
        <el-button type="primary">
          下一步
        </el-button>
      </div>
      <div v-else-if="recruit.step===1">
        1
      </div>
      <div v-else-if="recruit.step===2">
        2
      </div>
      <div v-else-if="recruit.step===3">
        3
      </div>
    </el-card>
  </div>
</template>
<script>
import { getSelfRecruit } from '@/api/imudges'
import { fetchUserInfo } from '@/api/user'

export default {
  name: 'ImudgesRecruit',
  data() {
    return {
      recruit: undefined,
      userinfo: undefined
    }
  },
  created() {
    this.getSelfInfo()
  },
  methods: {
    getSelfInfo() {
      getSelfRecruit().then(response => {
        this.recruit = response.data
        if (this.recruit.step === 0 || this.recruit.step === 1) {
          fetchUserInfo().then(res => {
            this.userinfo = res.data
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
