import React from 'react'
import PropTypes from 'prop-types'
import {flowRight} from 'lodash'
import getConfig from 'next/config'

import {_get, _post, _delete} from '../../lib/fetch'

import attachI18n from '../../components/hoc/attach-i18n'
import withSession from '../../components/hoc/with-session'

import Page from '../../components/page'
import Meta from '../../components/meta'
import Content from '../../components/content'
import Container from '../../components/container'
import RequireAuth from '../../components/require-auth'

import Header from '../../components/publication/header'
import Breadcrumbs from '../../components/publication/breadcrumbs'
import Producers from '../../components/publication/producers'

const {publicRuntimeConfig: {
  PUBLICATION_BASE_URL
}} = getConfig()

class ProducersPublicationPage extends React.Component {
  static propTypes = {
    organizationId: PropTypes.string.isRequired,
    session: PropTypes.shape({
      user: PropTypes.object
    }),

    tReady: PropTypes.bool.isRequired
  }

  static defaultProps = {
    session: null
  }

  static getInitialProps({query}) {
    return {
      organizationId: query.oid
    }
  }

  state = {}

  componentDidMount() {
    this.setState({
      producersPromise: this.fetchProducers(),
      organizationsPromise: _get(`${PUBLICATION_BASE_URL}/api/organizations`)
    })
  }

  fetchProducers = () => {
    const {organizationId} = this.props

    return _get(`${PUBLICATION_BASE_URL}/api/organizations/${organizationId}/producers`)
  }

  _getAssociateProducerPromise = async producer => {
    const {organizationId} = this.props

    await _post(`${PUBLICATION_BASE_URL}/api/organizations/${organizationId}/producers`, {
      _id: producer._id
    })

    return this.fetchProducers()
  }

  associateProducer = producer => {
    this.setState({
      producersPromise: this._getAssociateProducerPromise(producer)
    })
  }

  _getDissociateProducerPromise = async producer => {
    const {organizationId} = this.props

    await _delete(`${PUBLICATION_BASE_URL}/api/organizations/${organizationId}/producers/${producer._id}`)

    return this.fetchProducers()
  }

  dissociateProducer = producer => {
    this.setState({
      producersPromise: this._getDissociateProducerPromise(producer)
    })
  }

  renderAuth = user => {
    const {organizationId} = this.props
    const organization = user.organizations.find(org => org.id === organizationId)

    const {producersPromise, organizationsPromise} = this.state

    return (
      <div>
        <Meta title={`Producteurs | ${organization.name} | Publication`} />

        <Header user={user} organization={organization} />
        <Breadcrumbs organization={organization} page='producers' />
        <Producers
          organization={organization}
          promise={[producersPromise, organizationsPromise]}
          associateProducer={this.associateProducer}
          dissociateProducer={this.dissociateProducer}
        />
      </div>
    )
  }

  render() {
    const {tReady} = this.props

    return (
      <Page ready={tReady}>
        {() => (
          <React.Fragment>
            <Meta title='Publication' />
            <Content>
              <Container fluid>
                <RequireAuth
                  message='Vous devez être connecté pour accéder à l’interface de publication.'
                  render={this.renderAuth}
                />
              </Container>
            </Content>
          </React.Fragment>
        )}
      </Page>
    )
  }
}

export default flowRight(
  attachI18n(),
  withSession
)(ProducersPublicationPage)
