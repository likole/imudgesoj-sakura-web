<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="dataId" placeholder="测试数据组编号" @change="handleChange">
        <el-option
          v-for="item in dataIdList"
          :key="item"
          v-loading="listLoading"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <el-alert v-if="dataId===null" :closable="false"> 请选择你要操作的数据组↑ </el-alert>
    <div v-else>
      <el-form>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="输入">
              <el-button type="text" size="mini" @click="handleCopy(input,$event)">复制</el-button>
              <el-input v-model="input" type="textarea" :autosize="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="输出">
              <el-button type="text" size="mini" @click="handleCopy(output,$event)">复制</el-button>
              <el-input v-model="output" type="textarea" :autosize="true" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import { getDataIds, getData } from '../../api/data'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'ProblemAdmin',
  directives: { waves },
  data() {
    return {
      problemId: null,
      tempRoute: {},
      dataId: null,
      dataIdList: null,
      listLoading: true,
      input: '',
      output: ''
    }
  },
  created() {
    this.problemId = this.$route.params && parseInt(this.$route.params.id)
    this.tempRoute = Object.assign({}, this.$route)
    this.setTagsViewTitle()
    this.setPageTitle()
    this.getList()
  },
  methods: {
    setTagsViewTitle() {
      const title = '数据管理'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-题号${this.problemId}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '数据管理'
      document.title = `${title} - 题号${this.problemId}`
    },
    getList() {
      this.listLoading = true
      getDataIds(this.problemId).then(response => {
        this.dataIdList = response.data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleChange() {
      getData(this.problemId, this.dataId).then(response => {
        this.input = response.data[0]
        this.output = response.data[1]
      })
    },
    handleCopy(text, event) {
      clip(text, event)
    }
  }
}
</script>
<style scoped>
</style>
