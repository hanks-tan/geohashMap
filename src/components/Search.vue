<template>
  <div class="searchBox">
    <el-input 
      placeholder="搜geohash编码、经纬度" 
      v-model="input" 
      class="input-with-select">
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
      <div
        v-if="searchType === 'geohashCode'" 
        class="content">
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
      <div 
        v-else-if="searchType === 'coord'"
        class="content">
        <span>
         geohash编码：{{searchTextResult}}
        </span>
        <Copy 
          :textStr=info
          class="copyBar">
        </Copy>
      </div>
    </div>
  </div>
</template>

<script>
import {
  isCoord,
  isGeohashCode,
  coordStr2Arr
} from '../utils/util'
import geohash from '../utils/latlon'
import Copy from './Copy'
export default {
  data () {
    return {
      input: '',
      bound: {},
      center: [],
      boxInfoVisible: false,
      searchType: '',
      searchTextResult: ''
    }
  },
  components: {
    Copy
  },
  computed: {
    info () {
      if (this.searchType === 'geohashcode') {
        return `东经: ${this.bound.ne.lon}°\n` + 
          `西经: ${this.bound.sw.lon}°\n` + 
          `北纬: ${this.bound.ne.lat}°\n` + 
          `南纬: ${this.bound.sw.lat}°\n` + 
          `中心点：${this.center.lon}°, ${this.center.lat}°`
      } else if (this.searchType === 'coord') {
        this.searchTextResult
      }
      return ''
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
          this.searchType = 'coord'
        } else if (isGeohashCode(this.input)) {
          this.searchType = 'geohashCode'
        }
        this.showBoxInfo(this.input, this.searchType)
        this.$emit('search', {
          type: this.searchType,
          data: this.input
        })
      }
    },
    showBoxInfo (data, type) {
      if (type === 'coord') {
        let coord = coordStr2Arr(data)
        this.searchTextResult = geohash.encode(coord[1], coord[0])
      } else if (type === 'geohashCode') {
        this.bound = geohash.bounds(data)
        this.center = geohash.decode(data)
      }
      this.boxInfoVisible = true
    },
    closeHandle () {
      this.boxInfoVisible = false
      this.$emit('close', {
        type: this.searchType,
        data: this.input
      })
    }
  }
}
</script>

<style lang="less" scoped>
.searchBox{
  width: 25%;
  margin: 0.5rem;
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
      margin-top: 1rem;
      padding-right: 1rem;
      padding-top: 1rem;
      .copyBar{
        float: right;
      }
    }
  }
}
@media only screen and (max-width: 768px) {
  .searchBox{
    width: calc(100% - 1rem);
  }
}
</style>