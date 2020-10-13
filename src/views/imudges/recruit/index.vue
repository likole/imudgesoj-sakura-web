<template>
  <div class="app-container">
    <el-card v-if="recruit" style="margin-bottom: 20px">
      <el-steps :active="recruit.step" finish-status="success" align-center>
        <el-step title="完善个人信息" />
        <el-step title="提交报名信息" />
        <el-step title="笔试" />
        <el-step title="面试" />
        <el-step title="招新结束" />
      </el-steps>
    </el-card>
    <el-card v-if="recruit" v-loading="loading">

      <!-- start check info -->
      <div v-if="recruit.step===0">
        <el-alert
          title="温馨提示"
          type="warning"
          :closable="false"
          description="请不要在招新结束之前删除您的个人信息，以免我们联系不上您"
          style="margin-bottom: 20px"
          show-icon
        />
        <el-alert
          title="您的个人信息尚未完善"
          type="error"
          :closable="false"
          :description="recruit.extra"
          style="margin-bottom: 20px"
          show-icon
        />
        <p>
          请前往 <router-link to="/profile/index" style="color: royalblue">个人中心</router-link> 完善个人信息(包括基本信息和联系信息)，然后点击下方的“重新检查”
        </p>
        <el-button type="primary" @click="getSelfInfo">
          重新检查
        </el-button>
      </div>
      <!-- end check info -->

      <!-- start enroll -->
      <div v-else-if="recruit.step===1">
        <!-- enrolled -->
        <div v-if="recruit.hasEnrolled">
          <h3 style="color: forestgreen">报名成功！</h3>
          <p>您目前填报了
            <b>
              {{ recruit.firstWish && options[recruit.firstWish-1].label }}
              {{ recruit.secondWish && ', '+options[recruit.secondWish-1].label }}
              {{ recruit.thirdWish && ', '+options[recruit.thirdWish-1].label }}
            </b>
          </p>
          在报名截止之前您仍可以
          <el-button type="text" @click="reedit">
            修改报名信息
          </el-button>
        </div>
        <!-- enrolled -->
        <!-- first time-->
        <div v-else>
          <el-alert type="info" show-icon :closable="false" style="margin-bottom: 20px">
            至少填写一个志愿，至多填写三个志愿
          </el-alert>
          <el-alert type="warning" show-icon :closable="false" style="margin-bottom: 20px">
            三个志愿之间有优先级
          </el-alert>
          <el-select v-model="postForm.firstWish" placeholder="第一志愿">
            <el-option
              v-for="item in options"
              v-if="item.value !==postForm.secondWish && item.value!==postForm.thirdWish"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-if="postForm.firstWish" v-model="postForm.secondWish" :clearable="true" placeholder="第二志愿" @clear="postForm.thirdWish=''">
            <el-option
              v-for="item in options"
              v-if="item.value !==postForm.firstWish && item.value!==postForm.thirdWish"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-if="postForm.secondWish" v-model="postForm.thirdWish" :clearable="true" placeholder="第三志愿">
            <el-option
              v-for="item in options"
              v-if="item.value !==postForm.firstWish && item.value !== postForm.secondWish"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button :disabled="postForm.firstWish===''" type="primary" @click="enroll">
            提交报名信息
          </el-button>
        </div>
        <!-- first time-->
      </div>
      <!-- end enroll -->

      <div v-else-if="recruit.step===2">
        <div v-html="recruit.extra" />
      </div>
      <div v-else-if="recruit.step===3">
        3
      </div>
    </el-card>
  </div>
</template>
<script>
import { getSelfRecruit, postRecruitEnroll } from '@/api/imudges'

export default {
  name: 'ImudgesRecruitIndex',
  data() {
    return {
      loading: false,
      recruit: undefined,
      options: [
        { label: '前端', value: 1 },
        { label: '后端', value: 2 },
        { label: '移动开发', value: 3 },
        { label: '游戏开发', value: 4 },
        { label: '创新交互', value: 5 },
        { label: '机器学习', value: 6 }
      ],
      postForm: {
        firstWish: '',
        secondWish: '',
        thirdWish: ''
      }
    }
  },
  created() {
    this.getSelfInfo()
  },
  methods: {
    getSelfInfo() {
      this.loading = true
      getSelfRecruit().then(response => {
        this.recruit = response.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    enroll() {
      this.loading = true
      postRecruitEnroll(this.postForm).then(response => {
        this.getSelfInfo()
      }).catch(() => {
        this.loading = false
      })
    },
    reedit() {
      this.postForm.firstWish = this.recruit.firstWish
      this.postForm.secondWish = this.recruit.secondWish
      this.postForm.thirdWish = this.recruit.thirdWish
      this.recruit.hasEnrolled = false
    }
  }
}
</script>

<style scoped>

</style>
