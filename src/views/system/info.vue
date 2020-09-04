<template>
  <div class="app-container">
    <el-card v-if="memoryInfo.total" style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>资源占用情况</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: center">
          <el-progress type="dashboard" :percentage="Math.round(memoryInfo.used*100/memoryInfo.max)" :color="colors" />
          <br>
          {{ Math.round(memoryInfo.used/1024/1024) }}MB / {{ Math.ceil(memoryInfo.max/1024/1024) }}MB
          <br>
          JVM实际使用内存
        </el-col>
        <el-col :span="6" style="text-align: center">
          <el-progress type="dashboard" :percentage="Math.round(memoryInfo.total*100/memoryInfo.max)" :color="colors" />
          <br>
          {{ Math.round(memoryInfo.total/1024/1024) }}MB / {{ Math.ceil(memoryInfo.max/1024/1024) }}MB
          <br>
          JVM占用内存
        </el-col>
        <el-col :span="6" style="text-align: center">
          <el-progress type="dashboard" :percentage="0" :color="colors" />
          <br>
          还没实现
          <br>
          xxx
        </el-col>
        <el-col :span="6" style="text-align: center">
          <el-progress type="dashboard" :percentage="0" :color="colors" />
          <br>
          还没实现
          <br>
          xxx
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>系统配置信息</span>
      </div>
      <div v-for="(item,key) in configInfo" :key="key">
        <h4>{{ key }}</h4>
        <p>{{ item }}</p>
        <hr>
      </div>
    </el-card>
  </div>
</template>

<script>
import { fetchMemoryInfo, fetchConfigInfo } from '@/api/system'

export default {
  name: 'SystemInfo',
  data() {
    return {
      memoryInfo: {},
      configInfo: {},
      colors: [
        { color: '#e81616', percentage: 100 },
        { color: '#ef7515', percentage: 95 },
        { color: '#ffd80b', percentage: 90 },
        { color: '#54d023', percentage: 80 }
      ]
    }
  },
  created() {
    this.getAllInfo()
  },
  methods: {
    getAllInfo() {
      fetchMemoryInfo().then(response => {
        this.memoryInfo = response.data
      })
      fetchConfigInfo().then(response => {
        this.configInfo = response.data
      })
    }
  }
}
</script>
