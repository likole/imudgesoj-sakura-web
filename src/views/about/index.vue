<template>
  <div id="about">
    <el-button type="text" @click="$router.go(-1)"> &lt;&lt; 返回</el-button>
    <div style="text-align: center">
      <span class="anim-title" spellcheck="false">IMUDGES OJ</span>
      <span style="color: royalblue;font-weight: 800">{{ author }}</span>
    </div>
    <el-card :class="contentClass">
      <p>
        该OJ为内蒙古大学精英学生开发者联盟内部训练专用OJ（也可为学院OJ提供替代服务），基于<a href="https://github.com/zhblue/hustoj" target="_blank">HUSTOJ</a>开发。
        新版界面基于<a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin">vue-element-admin</a>开发。
      </p>
      <p>
        <a target="_blank" href="https://github.com/likole/imudgesoj-sakura-web">项目地址</a> |
        <a target="_blank" href="https://www.likole.com/2019/07/imudgesoj-v2-0/">开发记录</a> |
        <a target="_blank" href="https://www.likole.com/oj%e9%97%ae%e9%a2%98%e5%8f%8d%e9%a6%88/">问题反馈</a> |
        <span>V{{ version }}</span>
      </p>
    </el-card>

    <el-card :class="contentClass">
      维护人员: 陈丰（QQ 765324662）
    </el-card>
    <div style="position: fixed;bottom: 20px;width: 100%">
      <div style="margin: 0 auto;width: 520px;max-width: 100%;text-align: center;font-size: 12px">
        <p>COPYRIGHT © 2020 <a href="https://www.likole.com" target="_blank">Likole</a>. ALL RIGHTS RESERVED.</p>
        <p>GPLv2 licensed by <a href="https://github.com/zhblue/hustoj">HUSTOJ</a> 2020</p>
        <a href="http://www.beian.miit.gov.cn/" target="_blank" rel="nofollow" style="">浙ICP备18040075号-3</a>
      </div>
    </div>
  </div>
</template>

<script>
const util = {
  math: {
    degToRad: alpha => alpha * Math.PI / 180,

    polarToDecart: (alpha, r) => {
      alpha = this.degToRad(alpha)
      return { x: r * Math.cos(alpha), y: r * Math.sin(alpha) }
    }
  },

  color: {
    random: (opts = {}) => {
      const h = opts.hue || Math.floor(Math.random() * 360)
      const s = opts.saturation || Math.floor(Math.random() * 101)
      const l = opts.lightness || Math.floor(Math.random() * 101)

      return `hsl(${h}, ${s}%, ${l}%)`
    }
  }
}
class FunkyLetters {
  /**
   * Constructor
   * @param  {Element} el  document element with contenteditable=true or selector
   * @param  {Object} [opts] options
   */
  constructor(el, opts = {}) {
    if (typeof el === 'string') {
      el = document.querySelector(el)
    }
    this.container = el
    this.options = opts
    this._splitLetters()
    this._listenToInput()
  }

  /**
   * Split container's text into one letter spans optionally colored
   */
  _splitLetters() {
    this.container.innerHTML = FunkyLetters.splitTextLetters(this.container.textContent, this.options)
  }

  /**
   * Split the text into one letter spans
   * @param  {string} text input text
   * @param  {Object} [opts] options
   * @return {string}      html with text split into letters
   */
  static splitTextLetters(text, opts = {}) {
    text = text.replace(/\s+/, ' ')
    const letters = text.split(/(?=.)/)

    return letters.reduce((a, b) => a + FunkyLetters.makeLetterHtml(b, opts), '')
  }

  /**
   * Generate html string for a letter
   * @param  {string} letter single letter
   * @param  {Object} [opts]   options
   * @return {string}        html string
   */
  static makeLetterHtml(letter, opts = {}) {
    let style = ''
    let className = 'char'

    if (/\s/.test(letter)) {
      letter = ' '
      className += ' space'
    } else {
      className += ' letter'
    }
    if (opts.colorize) {
      style += 'color:' + util.color.random({ saturation: 100, lightness: 50 }) + ';'
    }

    return `<span class="${className}" ${style && 'style="' + style + '"'}><span class="letter-inner">${letter}</span></span>`
  }

  /**
   * Watch input
   */
  _listenToInput() {
    const me = this
    // this.container.dataset.text = this.container.textContent;

    this.container.addEventListener('keydown', function(e) {
      const letterEl = me.getFocusLetter()

      if (e.key.length === 1 && !e.altKey && !e.ctrlKey) {
        e.preventDefault()
        me.insertText(e.key)
        return
      }

      // If the container is empty
      if (!letterEl) return

      switch (e.key) {
        // Firefox focuses in two steps on inline-block elements
        case 'ArrowRight':
          if (navigator.userAgent.indexOf('AppleWebKit') !== -1) break
          if (!letterEl.nextElementSibling) break
          e.preventDefault()
          me.setFocus(letterEl.nextElementSibling, 1)
          break

        case 'ArrowLeft':
          if (navigator.userAgent.indexOf('AppleWebKit') !== -1) break
          e.preventDefault()
          if (!letterEl.previousElementSibling) {
            me.setFocus(letterEl, 0)
          } else {
            me.setFocus(letterEl.previousElementSibling, 1)
          }
          break

        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault()
          break

        case 'Home':
        case 'PageUp':
          e.preventDefault()
          me.setFocus(this.firstElementChild, 0)
          break

        case 'End':
        case 'PageDown':
          e.preventDefault()
          me.setFocus(this.lastElementChild, 1)
          break
      }
    })

    this.container.addEventListener('input', function(e) {
      // Firefox leaves empty containers when text is deleted. Make sure those are deleted too.
      me._cleanEmpty()
    })

    this.container.addEventListener('paste', function(e) {
      // eslint-disable-next-line eqeqeq
      if (e.clipboardData.types.indexOf('text/plain') != -1) {
        e.preventDefault()
        me.insertText(e.clipboardData.getData('text/plain'))
      }
    })
  }

  /**
   * Format text and insert it into the container at the caret position
   * @param  {string} text the text to insert
   */
  insertText(text) {
    const sel = document.getSelection()
    // eslint-disable-next-line no-unused-vars
    const range = document.createRange()
    let node = this.getFocusLetter()
    const isBeforeNode = sel.focusOffset === 0

    sel.deleteFromDocument()
    if (!node) {
      this.container.insertAdjacentHTML('afterbegin', FunkyLetters.splitTextLetters(text, this.options))
      this.setFocus(Array.from(this.container.querySelectorAll('.char')).pop(), 1)
    } else if (isBeforeNode) {
      node.insertAdjacentHTML('beforebegin', FunkyLetters.splitTextLetters(text, this.options))
      this.setFocus(node.previousElementSibling, 1)
    } else {
      node.insertAdjacentHTML('afterend', FunkyLetters.splitTextLetters(text, this.options))
      for (let i = text.length; i > 0 && node.nextElementSibling; i--) {
        node = node.nextElementSibling
      }
      this.setFocus(node, node.textContent.length)
    }

    this.container.dataset.changed = true
    this._cleanEmpty()
  }

  /**
   * Get the character in focus (at caret position)
   * @return {Element} the element node in focus
   */
  getFocusLetter() {
    const sel = document.getSelection()
    return sel.anchorNode.closest ? sel.anchorNode.closest('.char') : sel.anchorNode.parentElement.closest('.char')
  }

  /**
   * Set cursor position
   * @param {Element} node   letter element to focus on
   * @param {Integer} offset offset. In our case, either 0 or 1
   */
  setFocus(node, offset) {
    const sel = document.getSelection()
    const range = document.createRange()

    range.setStart(node, offset)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  /**
   * Delete elements other than .char the browser could have generated
   */
  _cleanEmpty() {
    const focusLetter = this.getFocusLetter()
    Array.from(this.container.children).forEach(el => {
      if (el.classList.contains('char') && el.textContent) return
      if (el === focusLetter) {
        if (el.previousElementSibling) {
          this.setFocus(el, 1)
        } else if (el.nextElementSibling) {
          this.setFocus(el.nextElementSibling, 1)
        }
      }
      el.remove()
    })
  }
}
class Animator {
  /**
   * Constructor
   * @param  {Element|string} el the container element whose children are being animated
   */
  constructor(el) {
    this.container = el
    this._removeClassTimer = null

    // this.container.addEventListener('animationend', () => {
    // 	clearTimeout(this._removeClassTimer);
    // 	this._removeClassTimer = setTimeout(() => {
    // 		this.container.classList.remove('anim');
    // 	}, 900);
    // });
  }

  /**
   * Run animation using the effect
   * @param  {string} effect effect name
   */
  animate(effect) {
    const cont = this.container
    if (cont.classList.contains('anim')) {
      cont.classList.remove('anim')
      setTimeout(() => {
        this.animate(effect)
      }, 50)
      return
    }
    clearTimeout(this._removeClassTimer)
    cont.classList.add('anim')
    if (cont.dataset.effect === effect && !('changed' in cont.dataset)) return
    cont.dataset.effect = effect
    delete cont.dataset.changed
    // if(effect !== 'converge'/* && effect !== 'spiral'*/ && effect !== 'meteorite') {
    // 	Array.prototype.forEach.call(cont.children, function(el) {
    // 		el.style.transform = '';
    // 	});
    // }
    if (!Animator.effects[effect]) {
      throw new Error(`Animator: effect ${effect} is not defined`)
    }
    if (Animator.effects[effect].delays) {
      this.distributeDelays(Animator.effects[effect].delays)
    } else {
      this.distributeDelays({ shift: false })
    }
  }

  /**
   * Distribute animation delays
   * @param  {Object} opts           options
   * @param  {Object} opts.shift     shift each next item this much milliseconds
   * @param  {Object} [opts.random]  distribute delays randomly: without regard to document order
   * @param  {Object} [opts.reverse] distribute delays in reverse document order starting with the last element
   */
  distributeDelays(opts) {
    const shift = opts.shift != null ? opts.shift : 100
    let curShift = 0
    let els = Array.from(this.container.children)

    if (opts.random) {
      const newEls = []
      for (let j = 0, l = els.length; j < l; j++) {
        const i = Math.floor(Math.random() * els.length)
        newEls.push(els.splice(i, 1)[0])
      }
      els = newEls
    }
    if (opts.reverse) {
      els = els.reverse()
    }

    els.forEach(el => {
      curShift += typeof shift === 'object' ? Math.round(Math.random() * (shift.max - shift.min) + shift.min) : shift
      el.style.animationDelay = el.querySelector('.letter-inner').style.animationDelay = ''
      if (shift === false) return
      el.style.animationDelay = (parseFloat(getComputedStyle(el, null).animationDelay) + curShift / 1000) + 's'
      el.querySelector('.letter-inner').style.animationDelay = (parseFloat(getComputedStyle(el.querySelector('.letter-inner'), null).animationDelay) + curShift / 1000) + 's'
    })
  }

  /**
   * Distribute children's offset positions
   * We are currently doing this in Sass
   * @param  {Object} opts options
   */
  distributeOffsets(opts) {
    let coords
    let alpha = opts.minAngle || 0
    let x = 100
    let y = 100
    const els = this.container.children

    for (let i = 0; i < els.length; i++) {
      if (opts.dx || opts.dy) {
        x -= opts.dx || 0
        y -= opts.dy || 0
      } else {
        if (opts.random) {
          alpha = Math.random * (opts.maxAngle || 360 - opts.minAngle || 0) + opts.minAngle || 0
          coords = util.math.polarToDecart(alpha, 100)
        } else {
          coords = util.math.polarToDecart(alpha, 100)
          alpha += opts.dAlpha
        }
        x = coords.x
        y = coords.y
      }
      els[i].style.transform = 'translate(' + x.toFixed(3) + 'vmax,' + y.toFixed(3) + 'vmax)'
    }
  }
}
export default {
  name: 'AboutIndex',
  data() {
    return {
      version: '0.1',
      innerVersion: '1',
      author: '',
      contentClass: 'content-hide',
      publicVisit: true
    }
  },
  created() {
    if (this.$route.fullPath && this.$route.fullPath.indexOf('index') !== -1) {
      this.publicVisit = false
    }
  },
  mounted() {
    new FunkyLetters(document.querySelector('.anim-title'), { colorize: true })
    Animator.effects = {
      fade: {
        delays: { shift: 80, random: true }
      }
    }
    new Animator(document.querySelector('.anim-title')).animate('fade')
    const self = this
    const tmp = 'By Likole'
    for (let i = 1; i <= tmp.length; i++) {
      setTimeout(function() {
        self.author = tmp.substr(0, i)
      }, 1800 + i * 80)
    }
    setTimeout(function() {
      self.contentClass = 'content-show'
    }, 1800)
  }
}
</script>

<style>
  @import "https://fonts.googleapis.com/css?family=Baloo+Chettan|Gloria+Hallelujah";

  #about{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10086;
    padding: 20px;
    background-color: rgb(255, 245, 229);
  }

  .anim-title {
    font: 4em "Baloo Chettan", Helvetica Neueu, HelveticaNeueu, Helvetica, Arial;
    white-space: nowrap;
    min-width: 1em;
    min-height: 1.2em;
    border-bottom: 1px solid transparent;
    caret-color: #f20dcc;
  }

  .content-hide{
    width:500px;
    margin: 20px auto 0;
    opacity: 0;
  }

  .content-show{
    width:500px;
    margin: 20px auto 0;
    opacity: 1;
    transition: all 3s;
  }

  .char {
    position: relative;
    margin: 0 .05em;
  }

  .char,
  .letter-inner {
    display: inline-block;
  }

  .anim[data-effect=fade] > .letter {
    animation: fadeIn 1.5s backwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(2);
    }
  }
</style>
<style scoped>
  a{
    color: royalblue;
  }
  a:hover{
    color: magenta;
    text-decoration: underline;
    text-underline: magenta;
  }
</style>
