<template>
  <div class="app-container">
    <h3>积分商城 目前积分：{{ score }}</h3>
    <el-row :gutter="20">
      <el-col v-for="(item,index) in goodsList" :key="index" :lg="8" :sm="12">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>{{ item.name }} </span>
            <span style="float: right">所需积分: {{ item.price }} 积分</span>
          </div>
          <p>{{ item.description }}</p>
          <p><b>有效时间：</b> {{ item.validityTime }} 小时</p>
          <p><b>最大持有数量：</b> {{ item.maxNum }}</p>
          <el-button v-if="item.ownedNum!==null&&item.ownedNum>=item.maxNum" type="success" disabled>已达到最大持有量</el-button>
          <el-button v-else-if="item.price>score" type="danger" disabled>积分不足</el-button>
          <el-button v-else type="success" @click="fetchGoods(item.id)">领取</el-button>
        </el-card>
      </el-col>
    </el-row>
    <h3>我的背包</h3>
    <el-row :gutter="20">
      <el-col v-for="(item,index) in bagList" :key="index" :lg="8" :sm="12">
        <el-card class="box-card" style="margin-bottom: 20px">
          <p><b>{{ item.goods.name }}</b> x {{ item.num }} </p>
          <p>过期时间： {{ item.expireTime }}</p>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { fetchBag, getTotalScore, achieveGoods } from '@/api/score'
import waves from '@/directive/waves' // waves directive
import { mapState } from 'vuex'
export default {
  name: 'PointsBag',
  directives: { waves },
  data() {
    return {
      score: 0,
      bagList: null,
      goodsList: null
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  created() {
    this.getStatus()
  },
  methods: {
    getStatus() {
      getTotalScore().then(response => {
        this.score = response.data
      })
      fetchBag().then(response => {
        this.bagList = response.data.bagList
        this.goodsList = response.data.goodsList
      })
    },
    fetchGoods(id) {
      achieveGoods(id).then(response => {
        this.getStatus()
      })
    }
  }
}
</script>

<style scoped>

</style>
