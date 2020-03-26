<template>
  <div class="app-container">
    <el-card class="box-card" style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <font color="green">Q</font>:如何查看答案错误、编译错误等详情
      </div>
      <div class="text item">
        <p><font color="red">A</font>:在状态列表点击对应的标签（答案错误、编译错误等）即可查看.</p>
        <p>查看答案错误，需要开通会员，请在会员中心开通（开通会员需要积分，每日刷够一定题数即可在积分中心领取）</p>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <font color="green">Q</font>:程序怎样取得输入、进行输出?
      </div>
      <div class="text item">
        <p><font color="red">A</font>:你的程序应该从标准输入 stdin('Standard Input')获取输入，并将结果输出到标准输出 stdout('Standard Output').</p>
        <p>用户程序不允许直接读写文件, 如果这样做可能会判为运行时错误 "<font color="green">Runtime Error</font>"。</p>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <font color="green">Q</font>:系统返回信息都是什么意思?
      </div>
      <div class="text item">
        <font color="red">A</font>:详见下述:<br>
        <p>
          <font color="blue">Pending</font> : 系统忙，你的答案在排队等待.<br>
          <font color="blue">Pending Rejudge</font>: 因为数据更新或其他原因，系统将重新判你的答案.<br>
          <font color="blue">Compiling</font> : 正在编译.<br>
          <font color="blue">Running &amp; Judging</font>: 正在运行和判断.<br>
          <font color="blue">Accepted</font> : 程序通过!<br>
          <font color="blue">Presentation Error</font> : 答案基本正确，但是格式不对。<br>
          <font color="blue">Wrong Answer</font> : 答案不对，仅仅通过样例数据的测试并不一定是正确答案，一定还有你没想到的地方.<br>
          <font color="blue">Time Limit Exceeded</font> : 运行超出时间限制，检查下是否有死循环，或者应该有更快的计算方法。<br>
          <font color="blue">Memory Limit Exceeded</font> : 超出内存限制，数据可能需要压缩，检查内存是否有泄露。<br>
          <font color="blue">Output Limit Exceeded</font>: 输出超过限制，你的输出比正确答案长了两倍.<br>
          <font color="blue">Runtime Error</font> : 运行时错误，非法的内存访问，数组越界，指针漂移，调用禁用的系统函数。请点击后获得详细输出。<br>
          <font color="blue">Compile Error</font> : 编译错误，请点击后获得编译器的详细输出。<br>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'FaqIndex'
}
</script>

<style scoped>

</style>
