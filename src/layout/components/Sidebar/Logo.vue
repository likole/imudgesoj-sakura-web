<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <span v-else class="sidebar-title"><mallki :text="title" /></span>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <span class="sidebar-title">
          <div v-if="theme==='theme-dark'">
            <span>IMUDGES</span>
            <span style="background-color: #f90;color: #000;padding: 2px;border-radius: 2px">OJ</span>
          </div>
          <mallki v-else :text="title" />
        </span>
      </router-link>
    </transition>
  </div>
</template>

<script>
import Mallki from '../../../components/TextHoverEffect/Mallki'

export default {
  name: 'SidebarLogo',
  components: { Mallki },
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'IMUDGES OJ',
      logo: 'logo.png'
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.likoleTheme
    }
  }
}
</script>

<style lang="scss" scoped>
  .theme-dark{
    .sidebar-logo-container {
      background: #1b1b1b;
      border-top: 1px solid #555;
      border-bottom: 1px solid #242424;

      & .sidebar-logo-link {
        & .sidebar-title {
          color: #fff;
        }
      }
    }
  }
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
