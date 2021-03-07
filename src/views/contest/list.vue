<template>
  <div class="app-container">
    <div v-if="cid===0">
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" :size="device==='desktop'?'medium':'mini'" @click="getContests">
          刷新
        </el-button>
        <el-input v-if="device==='desktop'" v-model="password" class="filter-item" style="width: 300px;margin-left: 10px" placeholder="如果访问的竞赛需要密码，请在此处输入" />
        <el-input v-else v-model="password" class="filter-item" style="width: 200px;margin-left: 10px" placeholder="竞赛访问密码" size="mini" />
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="contests"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        :size="device==='desktop'?'medium':'mini'"
      >
        <el-table-column label="编号" align="center" :width="device==='desktop'?'100px':'66px'">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.privateContest" icon-class="password" />
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center" min-width="250px">
          <template slot-scope="scope">
            <el-button type="text" :style="device==='mobile'?'padding: 0':''" @click="getProblems(scope.row.id)" v-html="scope.row.title" />
          </template>
        </el-table-column>
        <el-table-column label="允许语言" align="center" width="250px">
          <template v-if="languages.length>0" slot-scope="scope">
            <span v-for="language in scope.row.languages" :key="scope.row.id+''+language">
              <el-tag v-if="[0,1,3,6].includes(language)" style="margin: 0 2px"> {{ languages[language].name }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="230px">
          <template slot-scope="scope">
            <span v-if="scope.row.status===2" style="color: green"> 进行中 至 {{ scope.row.startTime }} </span>
            <span v-else-if="scope.row.status===1" style="color: royalblue"> 即将开始 @ {{ scope.row.startTime }} </span>
            <span v-else style="color: orangered"> 已结束 @ {{ scope.row.endTime }} </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="cid!==0">
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-back" :size="device==='desktop'?'medium':'mini'" @click="getContests">
          返回竞赛列表
        </el-button>
      </div>

      <h2 align="center" class="contest-title">{{ cid }} - <span v-html="contest.title" /></h2>
      <div align="center" class="contest-description" v-html="contest.description" />
      <div v-if="device==='desktop'" class="contest-time" style="margin-top: 20px;padding-bottom: 55px">
        <el-progress :percentage="progress" :show-text="false" />
        <p style="float: left">开始时间: {{ contest.startTime }}</p>
        <p style="float: right">结束时间: {{ contest.endTime }}</p>
      </div>
      <div v-else class="contest-time" style="margin-top: 20px;padding-bottom: 55px">
        <el-progress :percentage="progress" :show-text="false" />
        <p style="float: left;font-size: 14px">{{ contest.startTime }}</p>
        <p style="float: right;font-size: 14px">{{ contest.endTime }}</p>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="问 题" name="problems">
          <div class="filter-container">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" :size="device==='desktop'?'medium':'mini'" @click="getProblems(cid)">
              刷新
            </el-button>
          </div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="contest.problems"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :size="device==='desktop'?'medium':'mini'"
          >
            <el-table-column label="" align="center" :width="device==='desktop'?'80px':'28px'">
              <template slot-scope="scope">
                <div v-if="device==='desktop'">
                  <el-tag v-show="scope.row.result===2" type="success">Y</el-tag>
                  <el-tag v-show="scope.row.result===1" type="danger">N</el-tag>
                </div>
                <div v-else>
                  <p v-show="scope.row.result===2" style="color: green">Y</p>
                  <p v-show="scope.row.result===1" style="color: red">N</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="编号" align="center" :width="device==='desktop'?'150px':'115px'">
              <template slot-scope="scope">
                {{ scope.row.id }} Problem {{ scope.row.iid + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="标题" align="center" min-width="200px">
              <template slot-scope="scope">
                <router-link
                  :to="'/contest/submit/'+cid+'/'+scope.row.iid"
                  class="link-type"
                >
                  <span>{{ scope.row.title }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="device==='desktop'" label="来源" align="center" width="200px">
              <template slot-scope="scope">
                {{ scope.row.source }}
              </template>
            </el-table-column>
            <el-table-column label="解决" align="center" :width="device==='desktop'?'80px':'50px'">
              <template slot-scope="scope">
                {{ scope.row.accepted }}
              </template>
            </el-table-column>
            <el-table-column label="提交" align="center" :width="device==='desktop'?'80px':'50px'">
              <template slot-scope="scope">
                {{ scope.row.submit }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="状 态" name="status">
          <status-component v-if="activeTab==='status'" :cid="cid" />
        </el-tab-pane>
        <el-tab-pane label="排 名" name="ranklist">
          <contest-rank v-if="activeTab==='ranklist'" :cid="cid" />
        </el-tab-pane>
      </el-tabs>

    </div>

  </div>
</template>

<script>
import { fetchContests, fetchProblems } from '@/api/contest'
import { getAllLanguages } from '@/api/language'
import StatusComponent from '@/components/status/index'
import ContestRank from './components/contestrank'
import waves from '@/directive/waves' // waves directive
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

export default {
  name: 'ContestList',
  directives: { waves },
  components: { StatusComponent, ContestRank },
  data() {
    return {
      tableKey: 0,
      contests: null,
      contest: null,
      listLoading: true,
      cid: 0,
      progress: 0,
      activeTab: 'problems',
      password: '',
      languages: []
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  created() {
    if (Cookies.get('cid') !== undefined && Cookies.get('cid') !== '0') { this.getProblems(parseInt(Cookies.get('cid'))) } else { this.getContests() }
    this.computeProgress()
  },
  activated() {
    if (this.cid !== 0) {
      this.getProblems(this.cid)
    }
  },
  methods: {
    getContests() {
      if (this.languages.length === 0) {
        getAllLanguages().then(response => {
          this.languages = response.data
        })
      }
      this.cid = 0
      this.contest = null
      Cookies.set('cid', this.cid, { expires: 1 })
      this.listLoading = true
      fetchContests().then(response => {
        this.contests = response.data
        this.listLoading = false
      })
    },
    getProblems(cid) {
      this.listLoading = true
      fetchProblems(cid, this.password).then(response => {
        this.contest = response.data
        this.cid = parseInt(cid)
        Cookies.set('cid', this.cid, { expires: 1 })
        this.listLoading = false
      }).catch(() => {
        this.getContests()
      })
    },
    computeProgress() {
      if (this.contest != null) {
        const t1 = new Date(this.contest.startTime)
        const t2 = new Date(this.contest.endTime)
        const now = new Date()
        if (now <= t1) this.progress = 0
        else if (now >= t2) this.progress = 100
        else this.progress = (now - t1) / (t2 - t1) * 100
      }
      setTimeout(this.computeProgress, 1000)
    }
  }
}
</script>
<style lang="scss">
  .theme-dark{
    .contest-title{
      color: #f90;
    }
    .contest-description{
      color: #a2a2a2;
    }
    .contest-time{
      color: #fff;
    }
  }
</style>
