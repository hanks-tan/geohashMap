/* eslint-disable no-unused-vars */
<template>
<div class="main">
  <div class="map" id="map"></div>
  <GH></GH>
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
import GH from '../components/Github.vue'
export default {
  data () {
    return {
      mapObj: null,
      markers: {
        searchMarker: null,
        evtMarker: null
      },
      markerColors: {
        searchMarker: '#f74e4e',
        evtMarker: '#3FB1CE'
      },
      boxSourceId: 'boxSource'
    }
  },
  components: {
    Info,
    Search,
    GH
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
      this.showMarker(evt.lngLat, 'evtMarker')
    },
    mapSearchHandle (params) {
      if(params.type === 'coord') {
        let coord = coordStr2Arr(params.data)
        this.showMarker(coord, 'searchMarker')
        this.mapObj.flyTo({
          center: coord,
          zoom: 10
        })
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
    showMarker (coord, key) {
      if (!this.markers[key]) {
        this.markers[key] = new mapboxgl.Marker({
          color: this.markerColors[key]
        }).setLngLat(coord).addTo(this.mapObj)
      } else {
        this.markers[key].setLngLat(coord)
      }
    },
    clearPopHandle (data) {
      if (this.markers[data.type]) {
        this.markers[data.type].remove()
      }
      if (this.mapObj.getSource(this.boxSourceId)) {
        // geohash边界置为一个非常小的矩形
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
    bottom: 0;
    right: 0;
  }
  .searchBar{
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>