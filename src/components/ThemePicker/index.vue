<template>
  <div />
</template>

<script>
const version = require('element-ui/package.json').version // element-ui version from node_modules

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
      const oldVal = val === 'theme-light' ? '#F90' : '#409EFF'
      const newVal = val === 'theme-dark' ? '#F90' : '#409EFF'

      const $message = this.$message({
        message: '  主题切换中，请稍候......',
        customClass: 'theme-message',
        type: 'success',
        duration: 0,
        iconClass: 'el-icon-loading'
      })

      const getHandler = (variable, id) => {
        return () => {
          const newStyle = this.likoleUpdateStyle(this[variable], newVal === '#F90')

          let styleTag = document.getElementById(id)
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.setAttribute('id', id)
            document.head.appendChild(styleTag)
          }
          styleTag.innerText = newStyle
        }
      }

      if (!this.chalk) {
        const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
        await this.getCSSString(url, 'chalk')
      }

      const chalkHandler = getHandler('chalk', 'chalk-style')

      chalkHandler()

      const styles = [].slice.call(document.querySelectorAll('style'))
        .filter(style => {
          const text = style.innerText
          return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
        })
      styles.forEach(style => {
        const { innerText } = style
        if (typeof innerText !== 'string') return
        style.innerText = this.likoleUpdateStyle(innerText, val === '#F90')
      })

      this.$emit('change', val)

      $message.close()
    }
  },

  methods: {
    likoleUpdateStyle(style, dark) {
      const lightPrimaryCluster = this.getThemeCluster('409EFF')
      const darkPrimaryCluster = this.getThemeCluster('F90')
      const lightWhiteCluster = this.getThemeCluster('FFFFFF')
      const darkWhiteCluster = this.getThemeCluster('000000')

      let newStyle = style
      if (dark) {
        lightPrimaryCluster.forEach((color, index) => {
          newStyle = newStyle.replace(new RegExp(color, 'ig'), darkPrimaryCluster[index])
        })
        lightWhiteCluster.forEach((color, index) => {
          newStyle = newStyle.replace(new RegExp(color, 'ig'), darkWhiteCluster[index])
        })
      }
      return newStyle
    },

    getCSSString(url, variable) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
            resolve()
          }
        }
        xhr.open('GET', url)
        xhr.send()
      })
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
