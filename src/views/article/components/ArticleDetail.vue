<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+className[postForm.status]">
        <el-select v-model="postForm.problemId" :remote-method="getRemoteCategoryList" filterable default-first-option remote placeholder="关联问题编号" style="width: 250px">
          <el-option v-for="(item,index) in categoryListOptions" :key="index" :label="item.title" :value="item.id" />
        </el-select>
        <el-button @click="postForm.problemId=''">清空</el-button>
        <!--        <CommentDropdown v-model="postForm.commentDisabled" />-->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          发布/更新
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          保存为草稿
        </el-button>
      </sticky>
      <el-alert>提示：上方区域背景色为灰色时表示该文章为草稿状态；绿色表示已发布状态。</el-alert>

      <el-alert v-if="isEdit===false&&postForm.id" type="warning">注意：您现在已处于编辑状态，如需再次创建新文章，请 关闭当前标签页重新进入 或者 刷新页面。</el-alert>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="title" required>
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 30px;">
          <h3><span style="color: gray">摘要</span> <el-button type="text" @click="handleSummary">自动摘要</el-button></h3>
          <el-input v-model="postForm.summary" type="textarea" :autosize="true" maxlength="100" />
          <el-alert v-if="tmpSummary.length" :closable="false" style="margin-top: 10px">
            自动摘要：{{ tmpSummary }}
            <br>
            <el-button type="success" @click="postForm.summary=tmpSummary;tmpSummary=''">使用该摘要</el-button>
            <el-button type="danger" @click="tmpSummary=''">不使用该摘要</el-button>
          </el-alert>
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import {
  getArticle,
  searchProblemIds,
  createOrUpdateArticle,
  createOrUpdateDraftArticle,
  getSummary
} from '@/api/article'

const defaultForm = {
  id: undefined,
  title: '',
  content: '',
  summary: '',
  problemId: null,
  moreProblemIds: null,
  status: 0
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      categoryListOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },
      tempRoute: {},
      className: ['s0', 's1', 's2', 's3', 's4'],
      tmpSummary: ''
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.tempRoute = Object.assign({}, this.$route)
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchData(id) {
      getArticle(id).then(response => {
        this.postForm = response.data
        this.setTagsViewTitle()
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑文章'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑文章'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          createOrUpdateArticle(this.postForm)
            .then(response => {
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm = response.data
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题',
          type: 'warning'
        })
        return
      }
      createOrUpdateDraftArticle(this.postForm)
        .then(response => {
          this.$notify({
            title: '成功',
            message: '文章已保存为草稿',
            type: 'success',
            duration: 2000
          })
          this.postForm = response.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getRemoteCategoryList(query) {
      searchProblemIds(query).then(response => {
        if (!response.data) return
        this.categoryListOptions = response.data
      })
    },
    handleSummary() {
      getSummary(this.postForm.content).then(response => {
        this.tmpSummary = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
