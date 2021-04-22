<template>
  <div class="mapInfo">
    <div v-show="showSetting" class="setting">
      <span>精度</span>
      <!-- <el-input size="small" v-model="precision" class="pre"></el-input> -->
      <el-input-number 
        v-model="precision"
        controls-position="right" 
        size="mini"
        class="map-input"
        :min="1" 
        :max="12">
      </el-input-number>
    </div>
    <div class="content">
      <div>
        坐标:{{coord}},
      </div>
      <div>
        <span>geohash编码: {{geohashCode}}</span>
        <div class="tools">
          <Copy 
            :textStr="text" 
            class="btn-items">
          </Copy>
          <el-tooltip content="精度设置" placement="top">
            <i class="el-icon-setting btn-item" @click="showSetting = !showSetting"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import geohash from '../utils/latlon'
import Copy from './Copy'
export default {
  data () {
    return {
      geohashCode: '',
      coord: '',
      precision: 5,
      showSetting: false,
    }
  },
  components: {
    Copy
  },
  computed: {
    text () {
      return `坐标:${this.coord},\n` +
        `geohash编码: ${this.geohashCode}`
    }
  },
  watch: {
    coord ( newVal ) {
      this.convertCoordToCode(newVal)
    }
  },
  methods: {
    convertCoordToCode (coordStr) {
      if (coordStr) {
        let coordArr = coordStr.split(',').map((item) => {
          return parseFloat(item)
        })
        this.geohashCode = geohash.encode(coordArr[1], coordArr[0], this.precision)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .mapInfo{
    .setting{
      font-size: 13px;
      position: absolute;
      right: 0px;
      top: -50px;
      background-color: white;
      padding: 0.2rem;
      margin: 0;
      border-radius: 3px;
      padding-left: 0.5rem;
      .map-input{
        width: 5rem;
        margin-left: 0.5rem;
      }
    }
    .content{
      padding: 0.5rem;
      border-radius: 3px;
      text-align: left;
      background-color: white;
      box-shadow: 5px 5px 5px #888;
      .tools{
        float: right;
        .btn-item{
          margin-left: 5px;
          color: #409eff;
          cursor: pointer;
        }
      }
    }
  }
</style>