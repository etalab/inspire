import React from 'react'
import PropTypes from 'prop-types'
import {flowRight} from 'lodash'
import {translate} from 'react-i18next'
import mapboxgl from 'mapbox-gl'
import MapboxOmtLang from 'mapbox-omt-lang'

import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'

import enhanceMapData from './enhance-map-data'

import Empty from './empty'
import Feature from './feature'

class CenteredMap extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    bbox: PropTypes.array.isRequired,
    frozen: PropTypes.bool.isRequired,

    i18n: PropTypes.shape({
      language: PropTypes.string.isRequired
    }).isRequired
  }

  state = {
    highlight: null
  }

  constructor(props) {
    super(props)

    this.handlers = []

    if (!props.frozen) {
      for (const layer of ['point', 'polygon-fill', 'line']) {
        this.handlers.push({
          event: 'mousemove',
          layer,
          handler: this.onMouseMove.bind(this, layer)
        }, {
          event: 'mouseleave',
          layer,
          handler: this.onMouseLeave.bind(this, layer)
        })
      }
    }
  }

  componentDidMount() {
    const {frozen, bbox, i18n} = this.props

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
      interactive: !frozen
    })
    this.mapLanguage = new MapboxOmtLang(i18n.languages[0])

    this.map.once('load', this.onLoad)
    this.map.addControl(this.mapLanguage)

    this.map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      duration: 0
    })

    for (const {event, layer, handler} of this.handlers) {
      this.map.on(event, layer, handler)
    }

    i18n.on('languageChanged', this.onLanguageChange)
  }

  componentWillUnmount() {
    const {map} = this
    const {i18n} = this.props

    for (const {event, layer, handler} of this.handlers) {
      map.off(event, layer, handler)
    }

    i18n.off('languageChanged', this.onLanguageChange)
  }

  onLoad = () => {
    const {map} = this
    const {data} = this.props

    map.addSource('data', {
      type: 'geojson',
      data
    })

    map.addLayer({
      id: 'point',
      type: 'circle',
      source: 'data',
      paint: {
        'circle-radius': 5,
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#2c3e50',
          '#3099df'
        ],
        'circle-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.8,
          0.6
        ]
      },
      filter: ['==', '$type', 'Point']
    })

    map.addLayer({
      id: 'polygon-fill',
      type: 'fill',
      source: 'data',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#2c3e50',
          '#3099df'
        ],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.5,
          0.3
        ]
      },
      filter: ['==', '$type', 'Polygon']
    })

    map.addLayer({
      id: 'polygon-outline',
      type: 'line',
      source: 'data',
      paint: {
        'line-color': '#4790E5',
        'line-width': 2
      },
      filter: ['==', '$type', 'Polygon']
    })

    map.addLayer({
      id: 'line',
      type: 'line',
      source: 'data',
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#2c3e50',
          '#3099df'
        ],
        'line-width': 5,
        'line-opacity': 0.8
      },
      filter: ['==', '$type', 'LineString']
    })
  }

  onMouseMove = (layer, event) => {
    const {map} = this
    const canvas = map.getCanvas()
    canvas.style.cursor = 'pointer'

    const [feature] = event.features

    if (this.highlighted) {
      map.setFeatureState({source: 'data', id: this.highlighted}, {hover: false})
    }

    this.highlighted = feature.id
    map.setFeatureState({source: 'data', id: this.highlighted}, {hover: true})

    this.setState({
      highlight: {
        properties: feature.properties,
        count: event.features.length
      }
    })
  }

  onMouseLeave = () => {
    const {map} = this
    const canvas = map.getCanvas()
    canvas.style.cursor = ''

    if (this.highlighted) {
      map.setFeatureState({source: 'data', id: this.highlighted}, {hover: false})
    }

    this.setState({
      highlight: null
    })
  }

  onLanguageChange = () => {
    const {i18n} = this.props

    this.mapLanguage.setLanguage(i18n.languages[0])
  }

  render() {
    const {highlight} = this.state
    const {data} = this.props

    return (
      <div className='container'>
        <div ref={el => {
          this.mapContainer = el
        }} className='container' />

        {highlight && (
          <div className='info'>
            <Feature properties={highlight.properties} otherFeaturesCount={highlight.count - 1} />
          </div>
        )}

        {data.features.length === 0 && (
          <div className='info'>
            <Empty />
          </div>
        )}

        <style
          dangerouslySetInnerHTML={{__html: mapStyle}} // eslint-disable-line react/no-danger
        />
        <style jsx>{`
          .container {
            position: relative;
            height: 100%;
            width: 100%;
          }

          .info {
            position: absolute;
            pointer-events: none;
            top: 10px;
            left: 10px;
            max-width: 40%;
            overflow: hidden;
          }
        `}</style>
      </div>
    )
  }
}

export default flowRight(
  enhanceMapData,
  translate()
)(CenteredMap)
