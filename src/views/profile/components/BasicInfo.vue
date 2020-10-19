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
    <el-form-item label="班级">
      <el-cascader
        v-model="classroom"
        :options="classroomOptions"
        clearable
        style="width: 100%"
      />
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

function getCascaderFullValue(cascader, id) {
  const cascaderFullValue = [id]
  _getParentId(cascaderFullValue, cascader, cascader, id)

  return cascaderFullValue

  /**
   *
   * @param {Array} cascaderFullValue value for return
   * @param {Array} cascader value for loop
   * @param {Array} _cascader value of original
   * @param {number} _id  value of bottom item
   */
  function _getParentId(cascaderFullValue, cascader, _cascader, _id) {
    if (!Array.isArray(cascader)) return

    for (const cascaderItem of cascader) {
      if (!Array.isArray(cascaderItem.children)) continue

      const index = cascaderItem.children.findIndex(item => item.value === _id)
      if (index >= 0) {
        cascaderFullValue.unshift(cascaderItem.value)

        if (_cascader.findIndex(item => item.value === cascaderItem.value) < 0) {
          _getParentId(cascaderFullValue, _cascader, _cascader, cascaderItem.value)
        }
      } else {
        _getParentId(cascaderFullValue, cascaderItem.children, _cascader, _id)
      }
    }
  }
}

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
  data() {
    return {
      classroomOptions: [{ 'label': '计算机学院（软件学院）', 'value': 101, 'children': [{ 'label': '计算机科学与技术', 'value': 10101, 'children': null }, { 'label': '网络工程', 'value': 10102, 'children': null }, { 'label': '信息管理与信息系统', 'value': 10103, 'children': null }, { 'label': '电子商务', 'value': 10104, 'children': null }, { 'label': '数据科学与大数据技术', 'value': 10105, 'children': null }, { 'label': '软件工程一班', 'value': 10106, 'children': null }, { 'label': '软件工程二班', 'value': 10107, 'children': null }] }, { 'label': '电子信息工程学院', 'value': 102, 'children': [{ 'label': '电子信息科学与技术', 'value': 10201, 'children': null }, { 'label': '通信工程', 'value': 10202, 'children': null }, { 'label': '自动化', 'value': 10203, 'children': null }, { 'label': '其他', 'value': 10204, 'children': null }] }, { 'label': '数学科学学院', 'value': 103, 'children': [{ 'label': '数学与应用数学', 'value': 10301, 'children': null }, { 'label': '信息与计算科学', 'value': 10302, 'children': null }, { 'label': '统计学', 'value': 10303, 'children': null }, { 'label': '其他', 'value': 10304, 'children': null }] }, { 'label': '经济管理学院', 'value': 104, 'children': [{ 'label': '经济学', 'value': 10401, 'children': null }, { 'label': '金融学', 'value': 10402, 'children': null }, { 'label': '金融工程', 'value': 10403, 'children': null }, { 'label': '管理科学', 'value': 10404, 'children': null }, { 'label': '人力资源管理', 'value': 10405, 'children': null }, { 'label': '市场营销', 'value': 10406, 'children': null }, { 'label': '工商管理', 'value': 10407, 'children': null }, { 'label': '会计学', 'value': 10408, 'children': null }, { 'label': '财务管理', 'value': 10409, 'children': null }, { 'label': '其他', 'value': 10410, 'children': null }] }, { 'label': '文学与新闻传播学院', 'value': 105, 'children': [{ 'label': '新闻学', 'value': 10501, 'children': null }, { 'label': '编辑出版学', 'value': 10503, 'children': null }, { 'label': '播音与主持艺术', 'value': 10503, 'children': null }, { 'label': '其他', 'value': 10504, 'children': null }] }, { 'label': '外国语学院', 'value': 106, 'children': null }, { 'label': '物理学科与技术学院', 'value': 107, 'children': null }, { 'label': '化学化工学院', 'value': 108, 'children': null }, { 'label': '生命科学学院', 'value': 109, 'children': null }, { 'label': '生态与环境学院', 'value': 110, 'children': null }, { 'label': '其他学院', 'value': 111, 'children': null }],
      classroom: undefined
    }
  },
  watch: {
    user(value) {
      this.classroom = getCascaderFullValue(this.classroomOptions, value.classroom)
    }
  },
  methods: {
    handleUpdate() {
      this.$emit('loading')
      if (this.classroom.length >= 1 && this.classroom[0] !== null) {
        this.user.classroom = this.classroom[this.classroom.length - 1]
      } else {
        this.user.classroom = null
      }
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
