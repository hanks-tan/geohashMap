<template>
  <div id="app">
    <Main></Main>
    <div class="icp">
      <a href="http://beian.miit.gov.cn/">粤ICP备2020129319号</a>
    </div>
  </div>
</template>

<script>
import Main from './view/Index'

export default {
  name: 'app',
  components: {
    Main
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
  .icp{
    position: absolute;
    font-size: 14px;
    bottom: 10px;
    z-index: 1000;
    left: 0px;
    right: 0px;
    a{
      padding: 5px;
      background-color: #ecf5ffa1;
      border-radius: 3px
    }
  }
}
</style>
