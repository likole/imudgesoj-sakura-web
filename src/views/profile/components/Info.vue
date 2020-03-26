<template>
  <div>
    <el-alert>信息来自开放平台，如需修改，请前往开放平台修改。</el-alert>
    <p>姓名： {{info.name}} {{info.englishName}}</p>
    <p>性别： {{info.gender===0?'男':info.gender===1?'女':'其他'}}</p>
    <p>年级： {{info.grade}}</p>
    <p>邮箱： {{info.email1}} {{info.email2}}</p>
    <p>手机： {{info.phone1}} {{info.phone2}}</p>
    <p>QQ： {{info.qq}}</p>
    <p>学号： {{info.studentId}}</p>
    <p>Github： {{info.github}}</p>
    <p>个人网站： {{info.website}}</p>
  </div>
</template>

<script>
import { fetchProfileOauth } from '../../../api/user'

export default {
  data() {
    return {
      info: {}
    }
  },
  created() {
    fetchProfileOauth().then(response => {
      this.info = response.data
    })
  }
}
</script>
