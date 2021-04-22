<template>
  <div class="searchBox">
    <el-input placeholder="搜geohash编码、经纬度" v-model="input" class="input-with-select">
      <el-button type="primary" 
        slot="append"
        icon="el-icon-search" 
        @click="searchHandle">
      </el-button>
    </el-input>
    <div 
      v-if="boxInfoVisible"
      class="searchResult">
      <div>
        <i class="el-icon-close close" @click="closeHandle"></i>
      </div>
      <div class="content">
        <li>东经: {{bound.ne.lon}}°</li>
        <li>西经: {{bound.sw.lon}}°</li>
        <li>北纬: {{bound.ne.lat}}°</li>
        <li>南纬: {{bound.sw.lat}}°</li>
        <Copy 
          :textStr=info
          class="copyBar">
        </Copy>
        <li>中心点：{{`${center.lon}°, ${center.lat}°`}}</li>
      </div>
    </div>
  </div>
</template>

<script>
import {
  isCoord,
  isGeohashCode
} from '../utils/util'
import geohash from '../utils/latlon'
import Copy from './Copy'
export default {
  data () {
    return {
      input: '',
      bound: {},
      center: [],
      boxInfoVisible: false
    }
  },
  components: {
    Copy
  },
  computed: {
    info () {
      return `东经: ${this.bound.ne.lon}°\n` + 
      `西经: ${this.bound.sw.lon}°\n` + 
      `北纬: ${this.bound.ne.lat}°\n` + 
      `南纬: ${this.bound.sw.lat}°\n` + 
      `中心点：${this.center.lon}°, ${this.center.lat}°`
    }
  },
  watch: {
    boxInfoVisible (newVal) {
      if (!newVal) {
        this.bound = {}
        this.center = []
      }
    }
  },
  methods: {
    searchHandle () {
      if (this.input) {
        if(isCoord(this.input)) {
          this.$emit('search', {
            type: 'coord',
            data: this.input
          })
        } else if (isGeohashCode(this.input)) {
          this.$emit('search', {
            type: 'geohashCode',
            data: this.input
          })
          this.showBoxInfo(this.input)
        }
      }
    },
    showBoxInfo (hash) {
      this.bound = geohash.bounds(hash)
      this.center = geohash.decode(hash)
      this.boxInfoVisible = true
    },
    closeHandle () {
      this.boxInfoVisible = false
      this.$emit('close', {
        type: 'geohashCode',
        data: this.input
      })
    }
  }
}
</script>

<style lang="less" scoped>
.searchBox{
  width: 25%;
  .searchResult{
    background-color: white;
    border-radius: 3px;
    margin-top: 5px;
    box-shadow: 5px 5px 5px #888;
    .close{
      float: right;
      cursor: pointer;
      margin-right: 0.2rem;
      margin-top: 0.2rem;
    }
    .content{
      list-style: none;
      text-align: left;
      padding: 0.5rem;
      .copyBar{
        float: right;
      }
    }
  }
}
</style>