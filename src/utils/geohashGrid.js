/* eslint-disable no-unused-vars */
import Geohash from './latlon'
import geojson from 'geojson'
import { pointObjList2GeoJson } from './util'

class GeoHashGrid {
  constructor (options) {
    this.map = options.map
    this._layer = undefined
    this.defaults = {
      zoom: 3,
      maxDisplay: 10240,
      geohashPrecision: 12,
      geohashZoomScale: [
      // 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
        1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9
      ]
    }
    this.gridParts = []
    this.gridPoints = []
    this._layers = {}
    if (this.map) {
      this.map.on('load', () => {
        this.init()
      })
    }
  }
  init () {
    let data = this.getGridData()
    this.map.addSource('geohashPoint', {
      'type': 'geojson',
      'data': data.point
    })
    this.map.addSource('geohashGrid', {
      'type': 'geojson',
      'data': data.box
    })
    let geohashPointLayer = {
      'id': 'geohashPointLayer',
      'source': 'geohashPoint',
      'type': 'symbol',
      'layout': {
        'text-field': '{code}',
        'text-anchor': 'center',
        'text-size': 12
      }
      // 'type': 'circle',
      // 'paint': {
      //   'circle-radius': 10,
      //   'circle-color': '#007cbf'
      // }
    }
    let geohashGridLayer = {
      'id': 'geohashGridLayer',
      'source': 'geohashGrid',
      'type': 'fill',
      'layout': {},
      'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.2,
        'fill-outline-color': '#007bff',
      }
    }
    this.map.addLayer(geohashGridLayer)
    this.map.addLayer(geohashPointLayer)
    this._layers = {
      point: geohashPointLayer,
      polygon: geohashGridLayer
    }
    this.map.on('load', () => {
      this.refreshData()
    })
    this.map.on('moveend', () => {
      this.refreshData()
    })
  }

  getGridData () {
    this.gridParts = []
    this.gridPoints = []
    let zoomz = this.map.getZoom()
    let zoom = Math.round(zoomz)
    let level = this.defaults.geohashZoomScale[zoom],
      bounds = this.map.getBounds(),
      minX = bounds.getWest(),
      minY = bounds.getSouth(),
      maxX = bounds.getEast(),
      maxY = bounds.getNorth(),
      neHash = Geohash.encode(maxY, maxX, level),
      nwHash = Geohash.encode(maxY, minX, level),
      swHash = Geohash.encode(minY, minX, level),
      seHash = Geohash.encode(minY, maxX, level),
      current = neHash,
      eastBound = neHash,
      westBound = nwHash,
      maxHash = this.defaults.maxDisplay
    while (maxHash-- > 0) {
      this.drawBox(current)
      do {
        current = Geohash.adjacent(current, 'w')
        this.drawBox(current)
      } while (maxHash-- > 0 && current != westBound)
      if (current == swHash) {
        let boxGeoJson = geojson.parse(this.gridParts, {
          'Polygon': 'geom'
        })
        // let pointGeoJSON = geojson.parse(this.gridPoints, {
        //   'Point': ['lat', 'lng'] // geojson的 bug
        // })
        let pointGeoJSON = pointObjList2GeoJson(this.gridPoints, 'lng', 'lat')

        return {
          point: pointGeoJSON,
          box: boxGeoJson
        }
      }
      westBound = Geohash.adjacent(current, 's')
      current = eastBound = Geohash.adjacent(eastBound, 's')
    }
    alert('defaults.maxDisplay limit reached')
  }

  drawBox (hash) {
    const b = Geohash.bounds(hash)
    const extent = [b.sw.lon, b.sw.lat, b.ne.lon, b.ne.lat]
    const minX = b.sw.lon,
      minY = b.sw.lat,
      maxX = b.ne.lon,
      maxY = b.ne.lat
    let box = {
      code: hash,
      geom: [[
        [minX, minY],
        [maxX, minY],
        [maxX, maxY],
        [minX, maxY],
        [minX, minY]
      ]]
    }
    this.gridParts.push(box)
    let p = Geohash.decode(hash)
    let point = {
      code: hash,
      lng: p.lon,
      lat: p.lat
    }
    this.gridPoints.push(point)
  }
  refreshData () {
    let datas = this.getGridData()
    this.map.getSource('geohashGrid').setData(datas.box)
    this.map.getSource('geohashPoint').setData(datas.point)
  }
}

export default GeoHashGrid