<template>
  <div class="app-container">
    <h3>目前积分：{{ score }}</h3>
    <el-row :gutter="20">
      <el-col v-for="(item,index) in list" :key="index" :lg="6" :sm="12">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>{{ item.name }} （积分：{{ item.score }}）</span>
          </div>
          <p>
            {{ item.description }}
          </p>
          <el-button v-if="item.status===0" disabled="disabled">未达成条件</el-button>
          <el-button v-else-if="item.status===1" type="success" @click="updateStatus(index)">领取</el-button>
          <el-button v-else-if="item.status===2" type="success" disabled="disabled">已领取</el-button>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { fetchAchieveList, achieveOper } from '@/api/score'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ScoreAchieve',
  directives: { waves },
  data() {
    return {
      score: 0,
      list: null
    }
  },
  created() {
    this.getStatus()
  },
  methods: {
    getStatus() {
      fetchAchieveList().then(response => {
        this.list = response.data.score_list
        this.score = response.data.score
      })
    },
    updateStatus(id) {
      achieveOper(id).then(response => {
        this.list = response.data.score_list
        this.score = response.data.score
      })
    }
  }
}
</script>

<style scoped>

</style>
