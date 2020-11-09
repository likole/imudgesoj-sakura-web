<template>
  <div class="">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" :size="device==='desktop'?'medium':'mini'" @click="getRank">
        刷新
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="view"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :size="device==='desktop'?'medium':'mini'"
    >
      <el-table-column label="排名" align="center">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" min-width="110px">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" min-width="110px">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="解决" align="center">
        <template slot-scope="scope">
          {{ scope.row.solved }}
        </template>
      </el-table-column>
      <el-table-column label="Penalty" align="center">
        <template slot-scope="scope">
          {{ parseTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in pid" :key="index" :label="item.toString()" align="center">
        <template slot-scope="scope">
          <div class="rank-item">
            <span style="color: green">{{ parseTime(scope.row['pt'+item]) }}</span>
            <span v-if="scope.row['pc'+item]>0" style="color: red"> (-{{ scope.row['pc'+item] }}) </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { fetchRanklist } from '@/api/contest'
import waves from '@/directive/waves' // waves directive
import { mapState } from 'vuex'

export default {
  name: 'ContestRank',
  directives: { waves },
  props: {
    cid: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      pid: null,
      view: null,
      listLoading: true
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.viewsdevice
    })
  },
  mounted() {
    this.getRank()
  },
  methods: {
    getRank() {
      this.listLoading = true
      fetchRanklist(this.cid).then(response => {
        this.pid = response.data.pid
        this.view = response.data.view
        this.listLoading = false
      })
    },
    parseTime(t) {
      if (t === 0) {
        return ''
      }
      t = t / 1000
      const h = Math.floor(t / 3600)
      const m = Math.floor((t % 3600) / 60)
      const s = t % 60
      return h + ':' + m + ':' + s
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-dark{
  .rank-item{
    color: #000;
    font-weight: 800;
  }
}
</style>
