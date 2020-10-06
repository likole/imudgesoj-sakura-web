<template>
  <el-form label-width="80px" label-position="left">
    <el-form-item label="姓名">
      <el-input v-model="user.name" />
    </el-form-item>
    <el-form-item label="英文名">
      <el-input v-model="user.englishName" />
    </el-form-item>
    <el-form-item label="性别">
      <el-select v-model="user.gender" filterable placeholder="请选择">
        <el-option :key="0" label="男" :value="0" />
        <el-option :key="1" label="女" :value="1" />
        <el-option :key="2" label="其他" :value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="年级">
      <el-input v-model="user.grade" placeholder="例如：2019">
        <template slot="append">级</template>
      </el-input>
    </el-form-item>
    <el-form-item label="学号">
      <el-input v-model="user.studentId" />
    </el-form-item>
    <el-form-item label="github">
      <el-input v-model="user.github">
        <template slot="prepend">https://github.com/</template>
      </el-input>
    </el-form-item>
    <el-form-item label="个人网站">
      <el-input v-model="user.website" placeholder="应以 http:// 或者 https:// 开头" />
    </el-form-item>
    <el-form-item label="个人简介">
      <tinymce v-model="user.about" height="300px" style="margin-right: 5px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleUpdate">更新</el-button>
      <el-button type="primary" @click="$emit('reload')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Tinymce from '../../../components/Tinymce'
import { updateBasicInfo } from '../../../api/user'

export default {
  components: { Tinymce },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  methods: {
    handleUpdate() {
      this.$emit('loading')
      updateBasicInfo(this.user).then(() => {
        this.$notify({
          title: '更新成功',
          message: '用户信息更新成功',
          type: 'success',
          duration: 2000
        })
        this.$emit('reload')
      }).catch(() => {
        this.$emit('finish')
      })
    }
  }
}
</script>
