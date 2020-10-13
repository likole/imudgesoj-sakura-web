<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <el-form ref="form" :model="options" label-width="130px" label-position="top">
            <el-form-item label="报名截止时间">
              <el-date-picker
                v-model="options.enrollEndTime"
                type="datetime"
                :clearable="false"
                placeholder="报名截止时间"
              />
            </el-form-item>
            <el-form-item label="笔试通知内容">
              <el-input v-model="options.examNotification" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="笔试结果通知时间">
              <el-date-picker
                v-model="options.examResultNotifyTime"
                type="datetime"
                :clearable="false"
                placeholder="笔试结果通知时间"
              />
              *该时间以前不会通知笔试结果
            </el-form-item>
            <el-form-item label="面试通知内容">
              <el-input v-for="(_,index) in options.interviewNotification" :key="index" v-model="options.interviewNotification[index]" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="面试结果通知时间">
              <el-date-picker
                v-model="options.interviewResultNotifyTime"
                type="datetime"
                :clearable="false"
                placeholder="面试结果通知时间"
              />
              *该时间以前不会通知面试结果
            </el-form-item>
            {{options.admin}} {{options.interviewer}}
            <el-form-item>
              <el-button type="primary">更新</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            预览
          </div>
          <h3 style="color: royalblue">笔试通知</h3>
          <div v-html="options.examNotification" />
          <hr>
          <div v-for="(item,index) in options.interviewNotification" :key="index">
            <h3 style="color: royalblue">面试通知{{ index+1 }}</h3>
            <div v-html="item" />
            <hr>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getRecruitOptions } from '@/api/imudges'

export default {
  name: 'RecruitOptions',
  data() {
    return {
      options: {
        'enrollEndTime': undefined,
        'examNotification': undefined,
        'examResultNotifyTime': undefined,
        'interviewNotification': [],
        'interviewResultNotifyTime': undefined,
        'admin': [],
        'interviewer': []
      }
    }
  },
  created() {
    this.getOptions()
  },
  methods: {
    getOptions() {
      getRecruitOptions().then(response => {
        this.options = response.data
      })
    }
  }
}
</script>
