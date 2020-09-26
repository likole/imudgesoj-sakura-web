<template>
  <el-tabs v-model="activeTab" style="margin: 0 20px">
    <el-tab-pane label="所有文章" name="allArticle">
      <all-article />
    </el-tab-pane>
    <el-tab-pane label="我的文章" name="selfArticle">
      <self-article />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AllArticle from './components/AllArticle'
import SelfArticle from './components/SelfArticle'
export default {
  name: 'ArticleIndex',
  components: { AllArticle, SelfArticle },
  data() {
    return {
      activeTab: 'allArticle'
    }
  }
}
</script>
