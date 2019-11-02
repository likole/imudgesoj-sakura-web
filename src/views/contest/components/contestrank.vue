<template>
  <div class="">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="getRank">
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
    >
      <el-table-column label="排名" align="center">
        <template slot-scope="scope">
          {{ scope.row.rank }}
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center">
        <template slot-scope="scope">
          {{ scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.nick }}
        </template>
      </el-table-column>
      <el-table-column label="解决" align="center">
        <template slot-scope="scope">
          {{ scope.row.solved }}
        </template>
      </el-table-column>
      <el-table-column label="Penalty" align="center">
        <template slot-scope="scope">
          {{ scope.row.penalty }}
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in pid" :key="index" :label="item" align="center">
        <template slot-scope="scope">
          <div :style="'background-color: #'+scope.row['p'+item].bg_color">
            {{ scope.row['p'+item].text }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { fetchRanklist } from '@/api/contest'
import waves from '@/directive/waves' // waves directive

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
    }
  }
}
</script>

<style scoped>

</style>
