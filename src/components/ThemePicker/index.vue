<template>
  <div />
</template>

<script>
import { chalk } from '../../styles/chalk'

export default {
  data() {
    return {
      chalk: '', // content of theme-chalk css
      theme: ''
    }
  },
  computed: {
    defaultTheme() {
      return this.$store.state.settings.likoleTheme
    }
  },
  watch: {
    defaultTheme: {
      handler: function(val, oldVal) {
        this.theme = val
      },
      immediate: true
    },
    async theme(val) {
      const dark = (val === 'theme-dark')
      const getHandler = (variable, id) => {
        return () => {
          const newStyle = this.likoleUpdateStyle(this[variable], dark)
          let styleTag = document.getElementById(id)
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.setAttribute('id', id)
            document.head.appendChild(styleTag)
          }
          styleTag.innerText = newStyle
        }
      }
      const chalkHandler = getHandler('chalk', 'chalk-style')
      chalkHandler()
    }
  },
  created() {
    this.chalk = chalk.replace(/@font-face{[^}]+}/, '')
  },
  methods: {
    likoleUpdateStyle(style, dark) {
      let newStyle = style
      if (dark) {
        newStyle = this.likoleUpdateStyleCluster(newStyle, '409EFF', 'F90') // primary
        // newStyle = this.likoleUpdateStyleCluster(newStyle, '67C23A', '226003') // success
        // newStyle = this.likoleUpdateStyleCluster(newStyle, 'E6A23C', '825006') // warning
        // newStyle = this.likoleUpdateStyleCluster(newStyle, 'F56C6C', '7A0B0B') // warning
        // newStyle = newStyle.replace(new RegExp('F5F7FA', 'ig'), '262626') // base background (例如表格hover背景色)
        // newStyle = newStyle.replace(new RegExp('FFFFFF', 'ig'), '000000') // white background(大多数的背景色)
        newStyle = newStyle.replace(new RegExp('FFF', 'ig'), '000000') // white background(大多数的背景色)
        // newStyle = newStyle.replace(new RegExp('DCDFE6', 'ig'), '222') // base border(例如输入框未hover边框)
        // newStyle = newStyle.replace(new RegExp('EBEEF5', 'ig'), '242424') // lighter border(例如表格边框)
        // newStyle = newStyle.replace(new RegExp('303133', 'ig'), 'FFF') // primary text
        newStyle = newStyle.replace(new RegExp('606266', 'ig'), 'EEE') // regular text
      }
      return newStyle
    },
    likoleUpdateStyleCluster(style, original, current) {
      const originalCluster = this.getThemeCluster(original)
      const currentCluster = this.getThemeCluster(current)
      console.log(originalCluster, currentCluster)
      let newStyle = style
      originalCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), currentCluster[index])
      })
      return newStyle
    },
    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        if (tint === 0) { // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)

          return `#${red}${green}${blue}`
        }
      }

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        return `#${red}${green}${blue}`
      }

      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    }
  }
}
</script>

<style>
  .theme-message,
  .theme-picker-dropdown {
    z-index: 99999 !important;
  }

  .theme-picker .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
  }

  .theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
  }
</style>
