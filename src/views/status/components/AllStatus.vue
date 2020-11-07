<template>
  <div>

    <!--start desktop view-->
    <div v-if="device==='desktop'" class="filter-container">
      <el-input
        v-model="listQuery.problemId"
        placeholder="题目编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.userId"
        placeholder="用户"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.language"
        placeholder="语言"
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in languageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.result"
        placeholder="结果"
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in resultOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <!--end desktop view-->

    <!--   start mobile view-->
    <div v-else>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-input
            v-model="listQuery.problemId"
            placeholder="题目编号"
            style="width: 100%;"
            class="filter-item"
            size="mini"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="12">
          <el-input
            v-model="listQuery.userId"
            placeholder="用户"
            style="width: 100%;"
            class="filter-item"
            size="mini"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px">
        <el-col :span="12">
          <el-select
            v-model="listQuery.language"
            placeholder="语言"
            style="width: 100%"
            class="filter-item"
            size="mini"
            @change="handleFilter"
          >
            <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-select
            v-model="listQuery.result"
            placeholder="结果"
            style="width: 100%"
            class="filter-item"
            size="mini"
            @change="handleFilter"
          >
            <el-option
              v-for="item in resultOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-button type="primary" style="width: 100%;margin-top: 10px" size="mini" @click="handleFilter">过滤</el-button>
    </div>
    <!--   end mobile view-->

    <el-button-group :style="device==='desktop'?'margin:15px 0;':'margin:10px 0;width:100%'">
      <el-button type="primary" icon="el-icon-d-arrow-left" :size="device==='desktop'?'medium':'mini'" @click="firstPage">刷新/首页</el-button>
      <el-button type="primary" :size="device==='desktop'?'medium':'mini'" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
    </el-button-group>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :size="device==='desktop'?'medium':'mini'"
      :cell-style="{padding:'3px'}"
    >
      <el-table-column label="运行编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" min-width="110px">
        <template slot-scope="scope">
          <router-link :to="'/profile/user/'+scope.row.userId" class="link-type">
            {{ scope.row.userId }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="问题" align="center">
        <template slot-scope="scope">
          <div v-if="cid===0">
            <router-link
              :to="'/problem/submit/'+scope.row.problemId"
              class="link-type"
            >
              <span>{{ scope.row.problemId }}</span>
            </router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结果" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.result|statusFilter" size="mini" style="cursor: default">{{ scope.row.resultName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="内存" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time }} ms</span>
        </template>
      </el-table-column>
      <el-table-column label="语言" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.languageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码长度" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.codeLength }} B</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" min-width="125px">
        <template slot-scope="scope">
          <span>{{ scope.row.inDate| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="判题机" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.judger }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-button-group :style="'margin:20px 0;' + (device==='desktop'?'':'width:100%')">
      <el-button type="primary" icon="el-icon-d-arrow-left" :size="device==='desktop'?'medium':'mini'" @click="firstPage">刷新/首页</el-button>
      <el-button type="primary" :size="device==='desktop'?'medium':'mini'" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
    </el-button-group>

  </div>
</template>

<script>
import { fetchStatusOutside } from '@/api/problem'
import waves from '@/directive/waves' // waves directive
import { mapState } from 'vuex'

export default {
  name: 'AllStatusComponent',
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': 'info',
        '1': '',
        '2': 'warning',
        '3': 'warning',
        '4': 'success',
        '5': 'danger',
        '6': 'danger',
        '7': 'warning',
        '8': 'warning',
        '9': 'warning',
        '10': 'warning',
        '11': 'warning',
        '12': 'warning',
        '13': ''
      }
      return statusMap[status]
    }
  },
  props: {
    cid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        me: false,
        top: -1,
        next: -1,
        problemId: undefined,
        userId: undefined,
        language: '-1',
        result: '-1'
      },
      languageOptions: [{
        value: '-1', label: '所有语言'
      }, {
        value: '0', label: 'C'
      }, {
        value: '1', label: 'C++'
      }, {
        value: '3', label: 'Java'
      }, {
        value: '6', label: 'Python'
      }],
      resultOptions: [{
        value: '-1', label: '所有结果'
      }, {
        value: '4', label: '正确'
      }, {
        value: '5', label: '格式错误'
      }, {
        value: '6', label: '答案错误'
      }, {
        value: '7', label: '时间超限'
      }, {
        value: '8', label: '内存超限'
      }, {
        value: '9', label: '输出超限'
      }, {
        value: '10', label: '运行错误'
      }, {
        value: '11', label: '编译错误'
      }, {
        value: '0', label: '等待'
      }, {
        value: '1', label: '等待重判'
      }, {
        value: '2', label: '编译中'
      }, {
        value: '3', label: '运行并评判'
      }]
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.cid !== 0) this.listQuery.cid = this.cid
      this.listLoading = true
      fetchStatusOutside(this.listQuery).then(response => {
        this.list = response.data.list
        this.listQuery.next = response.data.next
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.top = -1
      this.getList()
    },
    firstPage() {
      this.listQuery.top = -1
      this.getList()
    },
    nextPage() {
      this.listQuery.top = this.listQuery.next
      this.getList()
    }
  }
}
</script>
