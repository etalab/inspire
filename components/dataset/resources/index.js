import React from 'react'
import {translate} from 'react-i18next'
import PropTypes from 'prop-types'

import DownloadResource from './resources/download'
import ServiceResource from './resources/service'
import PageResource from './resources/page'
import Preview from './preview'

class Downloads extends React.Component {
  static propTypes = {
    extent: PropTypes.object,

    resources: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired,
      proxyId: PropTypes.string,
      serviceId: PropTypes.string
    })).isRequired,

    t: PropTypes.func.isRequired
  }

  static defaultProps = {
    extent: null
  }

  state = {}

  setPreview = (link, name) => {
    console.log('foo', link, name)

    this.setState({
      preview: {
        link,
        name
      }
    })
  }

  clearPreview = () => {
    this.setState({
      preview: null
    })
  }

  renderResource(resource) {
    switch (resource.type) {
      case 'download':
        return (
          <DownloadResource
            resource={resource}
            setPreview={this.setPreview}
          />
        )

      case 'service':
        return (
          <ServiceResource
            resource={resource}
            setPreview={this.setPreview}
          />
        )

      case 'page':
        return (
          <PageResource resource={resource} />
        )

      default:
        return null
    }
  }

  render() {
    const {resources, extent, t} = this.props
    const {preview} = this.state

    if (resources.length === 0) {
      return t('downloads.noDownloads')
    }

    console.log(resources)

    return (
      <div>
        {resources.map(resource => (
          <div key={resource.proxyId || resource.serviceId} className='resource'>
            {this.renderResource(resource)}
          </div>
        ))}

        {preview && (
          <Preview
            title={preview.name}
            link={preview.link}
            extent={extent}
            onClose={this.clearPreview}
          />
        )}

        <style jsx>{`
          @import 'colors';

          ul {
            margin: 0;
            padding: 0;
            list-style-position: inside;
          }

          .resource {
            margin-bottom: 1.8em;

            &:last-child {
              margin-bottom: 0;
            }
          }

          .download {
            margin-bottom: 1.4em;

            &:last-child {
              margin-bottom: 0;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default translate('dataset')(Downloads)
