<template>
  <div class="app-container">
    <div v-if="!showDetail">
      <!-- 开始文章列表 -->
      <el-card v-for="(item,index) in list" :key="index" class="box-card" style="margin-bottom: 20px">
        <div slot="header" class="clearfix">
          <span v-if="item.sticky"><el-tag type="danger" size="mini">置顶</el-tag></span>
          <span v-if="item.problemId"><el-tag size="mini">P{{ item.problemId }}</el-tag></span>
          <span>{{ item.title }} - by {{ item.username }}</span>
          <span style="float: right">{{ item.updateTime }}</span>
        </div>
        <div v-html="item.summary" />
        <el-button type="text" style="margin-top: 10px" @click="getDetail(item.id)">查看全文</el-button>
      </el-card>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :page-sizes="[20]"
        :limit="20"
        :layout="device==='desktop'?'total, prev, pager, next, jumper':'prev, pager, next'"
        :small="device==='mobile'"
        @pagination="getList"
      />
      <!-- 结束文章列表 -->
    </div>
    <div v-else>
      <el-button type="text" @click="showDetail=false">&lt;&lt;返回</el-button>
      <!-- 开始文章详情 -->
      <el-row :gutter="20">
        <el-col :md="16">
          <el-card>
            <h2 style="text-align: center">{{ article.title }}</h2>
            <p style="text-align: center">作者：{{ article.username }} | 更新时间：{{ article.createTime }}</p>
            <div v-html="article.content" />
            <p>{{ article.username }}</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card v-if="article.problemId">
            <div slot="header" class="clearfix">
              <span>相关问题</span>
            </div>
            <div>
              <h3>P{{ problem.id }}: {{ problem.title }}</h3>
              <h3 style="color: royalblue">问题描述</h3>
              <div v-html="problem.description" />
              <h3 style="color: royalblue">输入</h3>
              <div v-html="problem.input" />
              <h3 style="color: royalblue">输出</h3>
              <div v-html="problem.output" />
              <router-link :to="'/problem/submit/'+problem.id">
                <el-button type="primary">前往该问题</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 结束文章详情 -->
    </div>
  </div>
</template>

<script>
import { getAvailArticleList, getArticle } from '@/api/article'
import { fetchProblem } from '@/api/problem'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapState } from 'vuex'

export default {
  name: 'ArticleIndex',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      page: 1,
      listLoading: true,
      article: {},
      problem: {},
      showDetail: false
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAvailArticleList(this.page).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getDetail(id) {
      this.listLoading = true
      getArticle(id).then(response => {
        this.article = response.data
        this.showDetail = true
        this.listLoading = false
        if (this.article.problemId) {
          fetchProblem(this.article.problemId).then(response => {
            this.problem = response.data
          })
        }
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
