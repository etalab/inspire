import React from 'react'
import PropTypes from 'prop-types'

const Producer = ({producer: {name, logo_thumbnail: logo}}) => (
  <div>
    <div className='wrapper'>
      <img src={logo} alt='' />
    </div>
    <h4>{name}</h4>

    <style jsx>{`
      .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        max-height: 100px;
        max-width: 100px;
        margin: auto;
      }

      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
      }

      h4 {
        text-align: center;
        margin-top: 1rem;
      }
    `}</style>
  </div>
)

Producer.propTypes = {
  producer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo_thumbnail: PropTypes.string.isRequired
  }).isRequired
}

export default Producer
