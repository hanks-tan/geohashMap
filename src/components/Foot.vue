<template>
  <div 
    v-if="aw"
    class="icp">
    <a href="http://beian.miit.gov.cn/">{{icpKey[0]}}</a>
  </div>
</template>

<script>
import { translateCW } from '../utils/util'
export default {
  data () {
    return {
      aw: '',
      key1: 'JUU3JUIyJUE0SUNQJUU1JUE0JTg3MjAyMDEyOTMxOSVFNSU4RiVCNw==',
      key2: 'aHR0cDovL2JlaWFuLm1paXQuZ292LmNu',
      icpKey: []
    }
  },
  watch: {
    aw (newVal) {
      if (newVal) {
        this.icpKey = [this.key1,this.key1].map((item) => translateCW(item))
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (process.env.NODE_ENV === 'production') {
        this.aw = 1
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
      border-radius: 3px;
      color: #3e3f41;
    }
  }
</style>