<template>
  <el-card style="margin-bottom:20px;">
    <!--    <div slot="header" class="clearfix">-->
    <!--      <span>About me</span>-->
    <!--    </div>-->

    <div v-if="user.role!==''" class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.role }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>基本信息</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            <p>用户名：{{ user.username }}</p>
            <p>昵称：{{ nickname }}</p>
            <following v-if="!me" :to-user="user.username" />
          </div>
        </div>
      </div>

      <div class="user-bio">
        <div class="user-education user-bio-section">
          <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>刷题概况</span></div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              <p>排名： {{ profileBasic.rank }}</p>
              <p>提交： {{ profileBasic.submit }}</p>
              <p>解决： {{ profileBasic.ac }}</p>
              <p v-for="(item,index) in profileBasic.status" :key="index">{{ item.name }}： {{ item.value }}</p>
            </div>
          </div>
        </div>
      </div>
      <pie-chart v-if="profileBasic.status!==undefined" :chart-data="profileBasic.status" />
    </div></el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import { fetchProfileSolution } from '@/api/user'
import PieChart from '@/components/problem/PieChart'
import Following from '@/views/profile/components/Following'
import { mapGetters } from 'vuex'

export default {
  components: { PanThumb, PieChart, Following },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          email: '',
          avatar: '',
          roles: ''
        }
      }
    },
    me: {
      type: Boolean,
      default: false
    },
    nickname: {
      type: String,
      default: ''
    },
    idForUpdate: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      profileBasic: {}
    }
  },
  computed: {
    ...mapGetters([
      'name' // self username
    ])
  },
  watch: {
    idForUpdate: {
      deep: true,
      handler(val) {
        // this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchProfileSolution(this.user.username).then(response => {
        this.profileBasic = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }

   .user-bio-section {
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }
   }
 }
</style>
