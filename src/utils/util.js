import geohash from './latlon'
import geojson from 'geojson'

export function coordStr2Arr (coordStr, sep) {
  if(!sep) {
    sep = ','
  }
  let arr = coordStr.split(sep).map((item) => {
    return parseInt(item)
  })
  return arr
}

export function isCoord (text) {
  if (text.indexOf(',') > -1) {
    return true
  }
  return false
}

export function isGeohashCode (text) {
  if (geohash.decode(text)) {
    return true
  }
  return false
}

export function box2Geojson (box) {
  let data = {
    geom: [
      [
        [box[0], box[1]],
        [box[2], box[1]],
        [box[2], box[3]],
        [box[0], box[3]],
        [box[0], box[1]]
      ]
    ]
  }
  return geojson.parse([data], {
    'Polygon': 'geom'
  })
}

export function pointObjList2GeoJson (pointObjList, xName, yName) {
  let pointGeoJSON = geojson.parse(pointObjList, {
    'Point': [yName, xName] // geojson的 bug
  })
  return pointGeoJSON
}

export function clipboard (text) {
  const textarea = document.createElement('textarea')
  document.body.appendChild(textarea)
  textarea.value = text
  textarea.select()
  if (document.execCommand) {
    document.execCommand('copy')
  }
  document.body.removeChild(textarea)
}