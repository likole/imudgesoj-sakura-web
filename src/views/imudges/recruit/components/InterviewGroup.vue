<template>
  <div>
    <el-card v-loading="loading">
      <div style="text-align: center">
        <el-transfer
          v-model="selected"
          filterable
          filter-placeholder="输入关键词搜索"
          :titles="['未分组', '即将被分组']"
          :data="options"
          style="text-align: left; display: inline-block"
        />
      </div>
    </el-card>

    <el-row :gutter="20">
      <el-col v-for="(item,index) in interviewNotification" :key="index" :md="12">
        <el-card v-loading="loading" style="margin-top: 20px">
          <div slot="header" class="clearfix">
            <span>第{{ index+1 }}组</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addGroup(index)">将上方右侧分组中的人员添加进该组</el-button>
          </div>
          {{ item }}
          <hr>
          <p v-for="(innerItem,innerIndex) in groups" v-if="innerItem.group===index" :key="innerIndex">{{ innerItem.sid }} - {{ innerItem.name }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-button v-loading="loading" type="danger" style="margin-top: 20px" @click="addGroup(-1)">清空所有分组信息（包括已分配的）</el-button>

  </div>
</template>
<script>
import { getGroupInfo, getRecruitOptions, postGroupInfo } from '@/api/imudges'

export default {
  name: 'InterviewGroup',
  data() {
    return {
      options: [],
      selected: [],
      groups: [],
      interviewNotification: 0,
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getGroupInfo().then(response => {
        this.options = response.data.options
        this.groups = response.data.groups
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      getRecruitOptions().then(response => {
        this.interviewNotification = response.data.interviewNotification
      })
    },
    addGroup(id) {
      this.loading = true
      postGroupInfo(id, this.selected).then(() => {
        this.getList()
        this.selected = []
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
