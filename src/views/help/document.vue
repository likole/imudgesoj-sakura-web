<template>
  <div class="app-container">
    <el-card class="box-card" style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        代码编辑器快捷键
      </div>
      <div class="text item">
        <table>
          <tbody>
            <tr>
              <td>功能描述</td>
              <td>Windows/Linux</td>
              <td>Mac</td>
            </tr>
            <tr>
              <td>全选</td>
              <td>Ctrl-A</td>
              <td>Cmd-A</td>
            </tr>
            <tr>
              <td>删除当前行光标后的内容</td>
              <td>无此功能</td>
              <td>Ctrl-K</td>
            </tr>
            <tr>
              <td>删除当前行</td>
              <td>Ctrl-D</td>
              <td>Cmd-D</td>
            </tr>
            <tr>
              <td>撤销</td>
              <td>Ctrl-Z</td>
              <td>Cmd-Z</td>
            </tr>
            <tr>
              <td>重做</td>
              <td>Ctrl-Y</td>
              <td>Shift-Cmd-Z, Cmd-Y</td>
            </tr>
            <tr>
              <td>撤销（选择也当做一个操作）</td>
              <td>Ctrl-U</td>
              <td>Cmd-U</td>
            </tr>
            <tr>
              <td>重做（选择也当做一个操作）</td>
              <td>Alt-U</td>
              <td>Shift-Cmd-U</td>
            </tr>
            <tr>
              <td>删除当前行光标左边部分</td>
              <td>无此功能</td>
              <td>Cmd-Backspace</td>
            </tr>
            <tr>
              <td>删除当前行光标右边部分</td>
              <td>无此功能</td>
              <td>Cmd-Delete</td>
            </tr>
            <tr>
              <td>查找</td>
              <td>Ctrl-F</td>
              <td>Cmd-F</td>
            </tr>
            <tr>
              <td>查找下一个</td>
              <td>Ctrl-G</td>
              <td>Cmd-G</td>
            </tr>
            <tr>
              <td>查找上一个</td>
              <td>Shift-Ctrl-G</td>
              <td>Shift-Cmd-G</td>
            </tr>
            <tr>
              <td>替换</td>
              <td>Shift-Ctrl-F</td>
              <td>Cmd-Alt-F</td>
            </tr>
            <tr>
              <td>替换全部</td>
              <td>Shift-Ctrl-R</td>
              <td>Shift-Cmd-Alt-F</td>
            </tr>
            <tr>
              <td>代码提示</td>
              <td>`（数字1左边）</td>
              <td>`</td>
            </tr>
            <tr>
              <td>全屏*</td>
              <td>F11</td>
              <td>F11</td>
            </tr>
            <tr>
              <td>退出全屏</td>
              <td>ESC</td>
              <td>ESC</td>
            </tr>
          </tbody>
        </table>
        <p>* 焦点在编辑器中有效，焦点在编辑器外会将整个网页全屏显示</p>
      </div>
    </el-card>
    <el-card>
      写文档太麻烦了，就先写个快捷键。。。其他有空再写
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HelpDocument'
}
</script>

<style scoped>

</style>
