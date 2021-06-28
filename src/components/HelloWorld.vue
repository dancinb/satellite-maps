<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>基础地图来自 OpenStreetMap，轨道数据来自 CelesTrak 使用 SPG4 算法</p>
    <p>此应用程序可能会通过浏览器请求您的硬件位置信息，用于定位</p>
    <p>我们还可能会使用百度统计来记录网站访客数量</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
a {
  color: #42b983;
}
</style>
