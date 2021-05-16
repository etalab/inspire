import React from 'react'
import PropTypes from 'prop-types'

import attachI18n from '../components/hoc/attach-i18n'

import Page from '../components/page'
import Meta from '../components/meta'
import Content from '../components/content'
import Container from '../components/container'

const LegalPage = ({tReady}) => (
  <Page ready={tReady}>
    {() => (
      <React.Fragment>
        <Meta title='Mentions légales' />

        <Content>
          <Container>
            <h1>Mentions légales</h1>
            <h3>Editeur</h3>
            <p>
              Direction interministérielle du numérique (DINUM)<br />
              {''}
              7, Avenue de Ségur<br />
              {''}
              75007 Paris 7<br />
              {''}
              dinsic-sec-directeur [à] modernisation.gouv.fr
            </p>

            <p>Directeur de la publication : M. Nadi Bou Hanna, DINSIC</p>

            <h3>Hébergeur</h3>
            <p>
              OVH<br />
              {''}
              SAS au capital de 10 059 500 €<br />
              {''}
              RCS Lille Métropole 424 761 419 00045<br />
              {''}
              Code APE 6311Z<br />
              {''}
              Siège social : 2 rue Kellermann - 59100 Roubaix - France.
            </p>
          </Container>
        </Content>

        <style jsx>{`
          h1 {
            font-size: 1.8rem;
            font-weight: 500;
            margin-bottom: 1em;
          }
        `}</style>
      </React.Fragment>
    )}
  </Page>
)

LegalPage.propTypes = {
  tReady: PropTypes.bool.isRequired
}

export default attachI18n()(LegalPage)
