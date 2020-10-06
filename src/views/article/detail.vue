<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :md="16">
        <el-card>
          <h2 style="text-align: center">{{ article.title }}</h2>
          <p style="text-align: center">作者：{{ article.username }} | 更新时间：{{ article.createTime }}</p>
          <div v-html="article.content" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-if="article.problemId">
          <div slot="header" class="clearfix">
            <span>相关问题</span>
          </div>
          <div>
            <h3>P{{ article.problem.id }}: {{ article.problem.title }}</h3>
            <h3 style="color: royalblue">问题描述</h3>
            <div v-html="article.problem.description" />
            <h3 style="color: royalblue">输入</h3>
            <div v-html="article.problem.input" />
            <h3 style="color: royalblue">输出</h3>
            <div v-html="article.problem.output" />
            <router-link :to="'/problem/submit/'+article.problem.id">
              <el-button type="primary">前往该问题</el-button>
            </router-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'

export default {
  name: 'ArticleDetail',
  data() {
    return {
      tempRoute: {},
      articleId: 0,
      article: {}
    }
  },
  created() {
    this.articleId = this.$route.params && parseInt(this.$route.params.id)
    this.tempRoute = Object.assign({}, this.$route)
    this.getDetail()
  },
  methods: {
    getDetail() {
      getArticle(this.articleId).then(response => {
        this.article = response.data
        this.setTagsViewTitle()
        this.setPageTitle()
      })
    },
    setTagsViewTitle() {
      const title = '文章/博客详情'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.article.title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '文章/博客详情'
      document.title = `${title} - ${this.article.title} - ${this.article.username}`
    }
  }
}
</script>
