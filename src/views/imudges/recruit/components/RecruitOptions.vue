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
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                placeholder="报名截止时间"
              />
              *该时间点之后将停止报名并显示笔试通知
            </el-form-item>
            <el-form-item label="笔试通知内容">
              <el-input v-model="options.examNotification" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="笔试结果通知时间">
              <el-date-picker
                v-model="options.examResultNotifyTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                placeholder="笔试结果通知时间"
              />
              *该时间以前不会通知笔试结果
            </el-form-item>
            <el-form-item label="面试通知内容">
              <div v-for="(_,index) in options.interviewNotification" :key="index">
                <!--开始-->
                <el-row :gutter="20">
                  <el-col :span="21">
                    <el-form-item label-width="0">
                      <el-input v-model="options.interviewNotification[index]" type="textarea" :placeholder="'第'+(index+1)+'组面试通知内容'" autosize />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-button size="small" type="danger" @click="options.interviewNotification.splice(index,1)">
                      移除
                    </el-button>
                  </el-col>
                </el-row>
                <!--结束-->
              </div>
              <el-button size="small" type="success" @click="options.interviewNotification.push('')">
                添加
              </el-button>
            </el-form-item>
            <el-form-item label="面试结果通知时间">
              <el-date-picker
                v-model="options.interviewResultNotifyTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                placeholder="面试结果通知时间"
              />
              *该时间以前不会通知面试结果
            </el-form-item>
            <el-form-item label="管理员列表">
              <div v-for="(_,index) in options.admin" :key="index">
                <!--开始-->
                <el-row :gutter="20">
                  <el-col :span="21">
                    <el-form-item label-width="0">
                      <el-input v-model="options.admin[index]" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-button size="small" type="danger" @click="options.admin.splice(index,1)">
                      移除
                    </el-button>
                  </el-col>
                </el-row>
                <!--结束-->
              </div>
              <el-button size="small" type="success" @click="options.admin.push('')">
                添加
              </el-button>
            </el-form-item>
            <el-form-item label="面试人员列表">
              <div v-for="(_,index) in options.interviewer" :key="index">
                <!--开始-->
                <el-row :gutter="20">
                  <el-col :span="21">
                    <el-form-item label-width="0">
                      <el-input v-model="options.interviewer[index]" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-button size="small" type="danger" @click="options.interviewer.splice(index,1)">
                      移除
                    </el-button>
                  </el-col>
                </el-row>
                <!--结束-->
              </div>
              <el-button size="small" type="success" @click="options.interviewer.push('')">
                添加
              </el-button>
            </el-form-item>
            <el-form-item label="联系信息">
              <el-input v-model="options.contactInfo" type="textarea" autosize />
              *笔试、面试时间冲突，罢面等情形的联系方式
            </el-form-item>
            <el-form-item label="面试通过通知内容">
              <el-input v-model="options.finalNotification" type="textarea" autosize />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateOptions">更新</el-button>
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
import { getRecruitOptions, updateRecruitOptions } from '@/api/imudges'

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
        'interviewer': [],
        'contactInfo': undefined,
        'finalNotification': undefined
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
    },
    updateOptions() {
      updateRecruitOptions(this.options).then(() => {
        this.$notify({
          title: '更新成功',
          message: '招新系统参数已更新成功',
          type: 'success',
          duration: 2000 })
      })
    }
  }
}
</script>
