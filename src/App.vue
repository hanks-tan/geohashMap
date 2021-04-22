<template>
  <div id="app">
    <Main></Main>
    <Foot></Foot>
    <!-- <div class="icp">
      <a href="http://beian.miit.gov.cn/">粤ICP备2020129319号</a>
    </div> -->
  </div>
</template>

<script>
import Main from './view/Index'
import Foot from './components/Foot'

export default {
  name: 'app',
  components: {
    Main,
    Foot
  }
}
</script>

<style lang='less'>
body{
  margin: 0;
  padding: 0;
  font-size: 16px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100%;
}
</style>
