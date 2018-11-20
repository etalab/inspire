import React from 'react'
import PropTypes from 'prop-types'
import getConfig from 'next/config'
import {uniqWith, isEqual, flowRight} from 'lodash'

import {_get} from '../lib/fetch'
import getSchemaOrg from '../lib/schema-org/dataset'

import attachI18n from '../components/hoc/attach-i18n'
import withErrors from '../components/hoc/with-errors'

import Page from '../components/page'
import Meta from '../components/meta'
import Content from '../components/content'
import Container from '../components/container'
import Box from '../components/box'

import Producer from '../components/dataset/producer'
import Datagouv from '../components/dataset/datagouv'
import Contacts from '../components/dataset/contacts'

import Header from '../components/dataset/header'
import Downloads from '../components/dataset/downloads'
import Discussions from '../components/dataset/discussions'

import Thumbnails from '../components/dataset/thumbnails'
import SpatialExtent from '../components/dataset/spatial-extent'
import Links from '../components/dataset/links'

import Metadata from '../components/dataset/metadata'

const {publicRuntimeConfig: {
  PUBLIC_URL,
  GEODATA_API_URL,
  DATAGOUV_API_URL
}} = getConfig()

class DatasetPage extends React.Component {
  static propTypes = {
    dataset: PropTypes.shape({
      recordId: PropTypes.string.isRequired,
      revisionDate: PropTypes.string,
      metadata: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        thumbnails: PropTypes.arrayOf(PropTypes.shape({
          originalUrlHash: PropTypes.string.isRequired
        })),
        spatialExtent: PropTypes.object,
        contacts: PropTypes.array.isRequired,
        links: PropTypes.array.isRequired,
        credits: PropTypes.string
      }).isRequired,

      organizations: PropTypes.array.isRequired,

      dataset: PropTypes.shape({
        distributions: PropTypes.array.isRequired
      }).isRequired
    }),

    datagouvPublication: PropTypes.shape({
      remoteId: PropTypes.isRequired
    }),

    pageUrl: PropTypes.string.isRequired,

    t: PropTypes.func.isRequired,
    tReady: PropTypes.bool.isRequired
  }

  static defaultProps = {
    dataset: null,
    datagouvPublication: null
  }

  static async getInitialProps({req, query, asPath}) {
    const [dataset, publications] = await Promise.all([
      _get(`${GEODATA_API_URL}/records/${query.did}`),
      _get(`${GEODATA_API_URL}/records/${query.did}/publications`)
    ])

    const datagouvPublication = publications.find(p => p.target === 'dgv')

    return {
      pageUrl: `${PUBLIC_URL}/${req.languages[0]}${asPath}`,
      dataset,
      datagouvPublication
    }
  }

  state = {
    datagouvDatasetPromise: null
  }

  componentDidMount() {
    const {datagouvPublication} = this.props

    // Let’s not depend too much on data.gouv.fr’s availability, so we’re
    // fetching this after the page has loaded.
    if (datagouvPublication && datagouvPublication.remoteId) {
      this.setState(() => ({
        datagouvDatasetPromise: _get(`${DATAGOUV_API_URL}/datasets/${datagouvPublication.remoteId}/`)
      }))
    }
  }

  render() {
    const {dataset: {
      recordId,
      revisionDate,
      metadata,
      dataset,
      organizations
    }, pageUrl, datagouvPublication, t, tReady} = this.props
    const {datagouvDatasetPromise} = this.state

    const contacts = uniqWith(metadata.contacts.map(contact => ({
      ...contact,
      // We don’t use this field and it causes some contacts to be duplicated.
      relatedTo: undefined
    })), isEqual)

    const hasThumbnails = metadata.thumbnails && metadata.thumbnails.length > 0
    const hasLinks = metadata.links.length > 0

    return (
      <Page ready={tReady}>
        {() => (
          <React.Fragment>
            <script type='application/ld+json'
              dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                __html: JSON.stringify(
                  getSchemaOrg(recordId, pageUrl, metadata, dataset.distributions)
                )
              }}
            />

            <Meta
              title={metadata.title}
              description={metadata.description}
              images={metadata.thumbnails && metadata.thumbnails.map(
                thumbnail => `${GEODATA_API_URL}/records/${recordId}/thumbnails/${thumbnail.originalUrlHash}`
              )}
            />

            <Content clouds>
              <Container fluid>
                <div className='container'>
                  <div className='left'>
                    {datagouvPublication && (
                      <Box title={t('blocks.producer')}>
                        <Producer promise={datagouvDatasetPromise} />
                      </Box>
                    )}

                    <Box title={t('blocks.datagouv')}>
                      <Datagouv
                        license={metadata.license}
                        organizations={organizations}
                        distributions={dataset.distributions}
                        publication={datagouvPublication}
                      />
                    </Box>

                    {contacts.length > 0 && (
                      <Box title={t('blocks.contacts')}>
                        <Contacts contacts={contacts} />
                      </Box>
                    )}

                    {metadata.credit && (
                      <Box title={t('blocks.credit')}>
                        {metadata.credit}
                      </Box>
                    )}
                  </div>

                  <div className='main'>
                    <Box>
                      <Header metadata={metadata} />
                    </Box>
                    <Box title={t('blocks.downloads')}>
                      <Downloads distributions={dataset.distributions} extent={metadata.spatialExtent} />
                    </Box>
                    {datagouvPublication && (
                      <Box title={t('blocks.discussions')}>
                        <Discussions remoteId={datagouvPublication.remoteId} />
                      </Box>
                    )}
                  </div>

                  {(hasThumbnails || metadata.spatialExtent || hasLinks) && (
                    <div className='right'>
                      {hasThumbnails && (
                        <Box title={t('blocks.thumbnails')}>
                          <Thumbnails recordId={recordId} thumbnails={metadata.thumbnails} />
                        </Box>
                      )}
                      {metadata.spatialExtent && (
                        <Box title={t('blocks.spatialExtent')}>
                          <SpatialExtent extent={metadata.spatialExtent} />
                        </Box>
                      )}
                      {hasLinks && (
                        <Box title={t('blocks.links')}>
                          <Links links={metadata.links} />
                        </Box>
                      )}
                    </div>
                  )}
                </div>

                <div className='footer'>
                  <Metadata id={metadata.id} revisionDate={revisionDate} />
                </div>
              </Container>
            </Content>

            <style jsx>{`
              .container {
                display: flex;
                flex-wrap: wrap;
                flex: auto;

                @media (max-width: 768px) {
                  flex-direction: column;
                }
              }

              .left, .right {
                width: 370px;

                @media (max-width: 1680px) {
                  width: 330px;
                }

                @media (max-width: 1480px) {
                  width: 310px;
                }

                @media (max-width: 1280px) {
                  width: 270px;
                }

                @media (max-width: 1080px) {
                  width: 230px;
                }
              }

              .left {
                margin-right: 20px;

                @media (max-width: 1080px) {
                  width: 38%;
                }

                @media (max-width: 768px) {
                  width: 100%;
                  margin: 0;
                  order: 1;
                }
              }

              .right {
                margin-left: 20px;

                @media (max-width: 1080px) {
                  flex: 1 0 100%;
                  width: 100%;
                  margin: 0;
                  order: 2;
                }
              }

              .main {
                flex: 1;

                @media (max-width: 768px) {
                  order: 0;
                }
              }

              .footer {
                margin-top: auto;
              }
            `}</style>
          </React.Fragment>
        )}
      </Page>
    )
  }
}

export default flowRight(
  attachI18n('dataset'),
  withErrors
)(DatasetPage)
