<template>
  <div class="">

    <!--start desktop view-->
    <div v-if="device==='desktop'" class="filter-container">
      <el-input
        v-model="listQuery.problem_id"
        placeholder="题目编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.user_id"
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
        v-model="listQuery.jresult"
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
      <el-select
        v-model="listQuery.showsim"
        placeholder="相似度"
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in simOptions"
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
            v-model="listQuery.problem_id"
            placeholder="题目编号"
            style="width: 100%;"
            class="filter-item"
            size="mini"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="12">
          <el-input
            v-model="listQuery.user_id"
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
            v-model="listQuery.jresult"
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

    <el-button-group :style="device==='desktop'?'margin:20px 0;':'margin:10px 0;width:100%'">
      <el-button type="primary" icon="el-icon-d-arrow-left" :size="device==='desktop'?'medium':'mini'" @click="firstPage">刷新/首页</el-button>
      <el-button type="primary" icon="el-icon-arrow-left" :size="device==='desktop'?'medium':'mini'" @click="prevPage">上一页</el-button>
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
      :cell-style="{padding:'0'}"
    >
      <el-table-column label="运行编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.solution_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" min-width="110px">
        <template slot-scope="scope">
          <router-link v-if="cid===0" :to="'/profile/user/'+scope.row.user_id" class="link-type">
            {{ scope.row.user_id }}
          </router-link>
          <span v-if="cid!==0">{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题" align="center">
        <template slot-scope="scope">
          <div v-if="cid===0">
            <router-link
              v-show="scope.row.problem_id!='0'"
              :to="'/problem/submit/'+scope.row.problem_id"
              class="link-type"
            >
              <span>{{ scope.row.problem_id }}</span>
            </router-link>
            <span v-show="scope.row.problem_id=='0'">{{ scope.row.problem_id }}</span>
          </div>
          <router-link
            v-if="cid!==0"
            :to="'/contest/submit/'+cid+'/'+scope.row.problem_id_num"
            class="link-type"
          >
            <span>{{ scope.row.problem_id }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="结果" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.result.ce===true"
            :type="scope.row.result.code|statusFilter"
            :size="device==='desktop'?'medium':'mini'"
            style="cursor: pointer"
            @click="handleCE(scope.row.solution_id)"
          >{{ scope.row.result.msg }}
          </el-tag>
          <el-tag
            v-else-if="scope.row.result.re===true"
            :type="scope.row.result.code|statusFilter"
            :size="device==='desktop'?'medium':'mini'"
            style="cursor: pointer;"
            @click="handleRE(scope.row.solution_id)"
          >{{ scope.row.result.msg }}
          </el-tag>
          <el-tag v-else :type="scope.row.result.code|statusFilter" :size="device==='desktop'?'medium':'mini'" style="cursor: default">{{ scope.row.result.msg }}</el-tag>
          <el-tag v-show="scope.row.result.sim_s_id!=undefined" :size="device==='desktop'?'medium':'mini'" style="cursor: default">{{ scope.row.result.sim_s_id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="内存" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="语言" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.language.sc==undefined">{{ scope.row.language.language }}</span>
          <el-button v-show="scope.row.language.sc==true" type="text" @click="showSource(scope.row.solution_id)">{{
            scope.row.language.language }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="代码长度" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code_length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.in_data| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
      <el-button type="primary" icon="el-icon-arrow-left" :size="device==='desktop'?'medium':'mini'" @click="prevPage">上一页</el-button>
      <el-button type="primary" :size="device==='desktop'?'medium':'mini'" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
    </el-button-group>
    <el-dialog
      title="查看源码"
      :visible.sync="sourceDialogVisible"
      :width="device==='desktop'?'70%':'95%'"
    >
      <p v-if="device==='mobile'">当前屏幕较小，您可以点击复制按钮，将代码复制到其他地方查看</p>
      <pre :style="device==='mobile'?'font-size: 10px':''">{{ source }}</pre>
      <el-button type="primary" @click="handleCopy(source,$event)">复制</el-button>
    </el-dialog>
    <el-dialog
      title="详情"
      :visible.sync="detailDialogVisible"
      :width="device==='desktop'?'70%':'95%'"
    >
      <pre>{{ detail }}</pre>
    </el-dialog>

  </div>
</template>

<script>
import { fetchStatus, fetchSource, fetchCE, fetchRE } from '@/api/problem'
import clip from '@/utils/clipboard'
import waves from '@/directive/waves' // waves directive
import { mapState } from 'vuex'

export default {
  name: 'StatusComponent',
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
        top: -1,
        bottom: 0,
        problem_id: undefined,
        user_id: undefined,
        language: '-1',
        jresult: '-1',
        showsim: '0',
        cid: 0
      },
      sourceDialogVisible: false,
      source: '',
      detailDialogVisible: false,
      detail: '',
      downloadLoading: false,
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
      }],
      simOptions: [{
        value: '0', label: '所有相似度'
      }, {
        value: '50', label: '50%'
      }, {
        value: '60', label: '60%'
      }, {
        value: '70', label: '70%'
      }, {
        value: '80', label: '80%'
      }, {
        value: '90', label: '90%'
      }, {
        value: '100', label: '100%'
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
      fetchStatus(this.listQuery).then(response => {
        this.list = response.data.item
        this.listQuery.top = response.data.top
        this.listQuery.bottom = response.data.bottom
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
    prevPage() {
      this.listQuery.top = this.listQuery.top + 20
      this.getList()
    },
    nextPage() {
      this.listQuery.top = this.listQuery.bottom
      this.getList()
    },
    showSource(id) {
      this.source = ''
      fetchSource(id).then(response => {
        this.source = response.data
        this.sourceDialogVisible = true
      })
    },
    handleCE(id) {
      this.detail = ''
      fetchCE(id).then(response => {
        this.detail = response.data.detail
        this.detailDialogVisible = true
      })
    },
    handleRE(id) {
      this.detail = ''
      fetchRE(id).then(response => {
        this.detail = response.data
        this.detailDialogVisible = true
      })
    },
    handleCopy(text, event) {
      clip(text, event)
    }
  }
}
</script>
