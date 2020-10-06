<template>
  <div class="app-container">
    <h3>目前积分：{{ score }}</h3>
    <el-row :gutter="20">
      <el-col v-for="(item,index) in list" :key="index" :lg="12">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>【{{ item.frequencyName }}】 {{ item.name }} （{{ item.score }} 积分）</span>
          </div>
          <p>
            {{ item.description }}
          </p>
          <el-button v-if="item.status===30" type="warning" disabled="disabled">前置 "{{ item.preTaskName }}" 未完成</el-button>
          <el-button v-if="item.status===20" type="danger" disabled="disabled">进行中</el-button>
          <el-button v-else-if="item.status===10" type="success" @click="updateStatus(item.id)">领取</el-button>
          <el-button v-else-if="item.status===40" type="success" disabled="disabled">已于 {{ item.finishedTime }} 领取</el-button>
          <el-button v-else-if="item.status===50" disabled="disabled">已失效</el-button>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { fetchAchieveList, achieveOper, getTotalScore } from '@/api/score'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'PointsTask',
  directives: { waves },
  data() {
    return {
      score: undefined,
      list: null
    }
  },
  created() {
    this.getStatus()
  },
  methods: {
    getStatus() {
      getTotalScore().then(response => {
        this.score = response.data
      })
      fetchAchieveList().then(response => {
        this.list = response.data
      })
    },
    updateStatus(id) {
      achieveOper(id).then(response => {
        this.getStatus()
      })
    }
  }
}
</script>

<style scoped>

</style>
