/* eslint-disable no-unused-vars */
<template>
<div class="main">
  <div class="map" id="map"></div>
  <Search
    @search="mapSearchHandle"
    @close="clearPopHandle"
    class="searchBar">
  </Search>
  <Info
    ref="tools"
    class="info">
  </Info>
</div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import GeoHashGrid from '../utils/geohashGrid'
import Info from '../components/Info'
import Search from '../components/Search'
import { 
  coordStr2Arr,
  box2Geojson
} from '../utils/util'
import geohash from '../utils/latlon'
export default {
  data () {
    return {
      mapObj: null,
      marker: null,
      boxSourceId: 'boxSource'
    }
  },
  components: {
    Info,
    Search
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 参考 http://www.mapbox.cn/mapbox-gl-js/api/
      // mapboxgl.accessToken = 'pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiY2pzbmg0Nmk5MGF5NzQzbzRnbDNoeHJrbiJ9.7_-_gL8ur7ZtEiNwRfCy7Q' ol的key
      mapboxgl.accessToken = 'pk.eyJ1IjoiaGlrZXI3IiwiYSI6ImNqd2J1bnAzMTAydmEzenBsYWNsdmNtbnEifQ.yIals3oQAWta-jougYrCNQ'
      mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js')
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/outdoors-v10',
        center: [108.902344, 33.661133],
        zoom: 3,
        attributionControl: false
      })
      let languageControl = new MapboxLanguage({
        defaultLanguage: 'zh'
      })
      map.addControl(languageControl)
      this.mapObj = map
      // eslint-disable-next-line no-unused-vars
      let geohashLayer = new GeoHashGrid({
        map: map
      })
      map.on('click', (evt) => {
        this.dispatchEventMapClick(evt)
      })
    },
    addPopBoxLayer (data) {
      let source = {
        type: 'geojson',
        data: data
      }
      this.mapObj.addSource(this.boxSourceId, source)
      let searchBox = {
        'id': 'searchBox',
        'type': 'fill',
        'source': this.boxSourceId,
        'layout': {},
        'paint': {
          // 'fill-color': '#088',
          'fill-color': '#409eff',
          'fill-opacity': 0.3
        }
      }
      this.mapObj.addLayer(searchBox)
    },
    dispatchEventMapClick (evt) {
      if (this.$refs.tools) {
        this.$refs.tools.coord = evt.lngLat.toArray().join(',')
      }
      this.showMarker(evt.lngLat)
    },
    mapSearchHandle (params) {
      if(params.type === 'coord') {
        let coord = coordStr2Arr(params.data)
        this.showMarker(coord)
        this.mapObj.setCenter(coord)
      } else if (params.type === 'geohashCode') {
        let coord = geohash.decode(params.data)
        if (coord) {
          let b = geohash.bounds(params.data)
          const extent = [b.sw.lon, b.sw.lat, b.ne.lon, b.ne.lat]
          this.showBox(extent)
          this.mapObj.fitBounds([b.sw, b.ne], {
            padding: {top: 25, bottom: 25, left: 15, right: 15}
          })
        }
      }
    },
    showBox (extent) {
      let json = box2Geojson(extent)
      if (!this.mapObj.getSource(this.boxSourceId)){
        this.addPopBoxLayer(json)
      } else {
        this.mapObj.getSource(this.boxSourceId).setData(json)
      }
    },
    showMarker (coord) {
      if (!this.marker) {
        this.marker = new mapboxgl.Marker().setLngLat(coord).addTo(this.mapObj)
      } else {
        this.marker.setLngLat(coord)
      }
    },
    clearPopHandle () {
      if (this.mapObj.getSource(this.boxSourceId)) {
        const code = 'wq517dd923zz'
        const b = geohash.bounds(code)
        const extent = [b.sw.lon, b.sw.lat, b.ne.lon, b.ne.lat]
        const json = box2Geojson(extent)
        this.mapObj.getSource(this.boxSourceId).setData(json)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  height: 100%;
  width: auto;
  .map{
    height: 100%;
    width: 100%;
  }
  .info{
    z-index: 100;
    position: absolute;
    // top: 10px;
    bottom: 10px;
    right: 10px;
  }
  .searchBar{
    z-index: 100;
    position: absolute;
    top: 10px;
    left: 10px;
  }
}
</style>