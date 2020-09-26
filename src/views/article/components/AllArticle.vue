<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.keywords" placeholder="关键词" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.problemId" type="number" placeholder="关联问题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <!-- 开始文章列表 -->
    <el-row v-loading="listLoading" :gutter="20">
      <el-col v-for="(outerItem,outerIndex) in [0,1,2]" :key="outerIndex" :span="8">
        <el-card v-for="(item,index) in list" v-if="index%3===outerItem" :key="index" class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span v-if="item.sticky"><el-tag type="danger" size="mini">置顶</el-tag></span>
            <span v-if="item.problemId"><el-tag size="mini">P{{ item.problemId }}</el-tag></span>
            <span style="">{{ item.title }}</span>
            <span style="float: right">By {{ item.username }}</span>
          </div>
          <div v-html="item.summary" />
          <router-link :to="'/article/detail/'+item.id">
            <el-button type="text" style="margin-top: 10px">查看全文</el-button>
          </router-link>
          <router-link :to="'/article/edit/'+item.id">
            <el-button v-if="item.editable" type="text" style="margin-top: 10px">编辑</el-button>
          </router-link>
        </el-card>
      </el-col>
    </el-row>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :page-sizes="[9]"
      :limit="9"
      :layout="device==='desktop'?'total, prev, pager, next, jumper':'prev, pager, next'"
      :small="device==='mobile'"
      @pagination="getList"
    />
    <!-- 结束文章列表 -->
  </div>
</template>

<script>
import { getAvailArticleList } from '@/api/article'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapState } from 'vuex'

export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        keywords: '',
        problemId: ''
      },
      list: null,
      listLoading: true
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
      getAvailArticleList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
