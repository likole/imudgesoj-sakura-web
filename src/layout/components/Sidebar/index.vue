<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- NEED_UPDATE: 在此处颜色使用了部分固定值，如果在variable.css中更改了值，需要在这儿更换下     -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="theme==='theme-dark'?'#1c1c1c':'#304156'"
        :text-color="theme==='theme-dark'?'#a2a2a2':'#bfcbd9'"
        :unique-opened="false"
        :active-text-color="theme==='theme-dark'?'#f90':'#409EFF'"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    theme() {
      return this.$store.state.settings.likoleTheme
    }
  }
}
</script>
