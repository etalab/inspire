import React from 'react'
import { shallow } from 'enzyme'
import Loader from '../Loader'

describe('Loader', () => {
  it('should display a loader when isLoading is true', () => {
    const wrapper = shallow(<Loader isLoading />)

    expect(wrapper).to.containMatchingElement(<div><div>Chargement…</div></div>)
  })

  it('should change the label when defined', () => {
    const wrapper = shallow(<Loader isLoading label='Hello' />)

    expect(wrapper).to.containMatchingElement(<div>Hello</div>)
  })

  it('should display an error when not isLoading and errored', () => {
    const error = new Error('Sorry…')
    const wrapper = shallow(<Loader isLoading={false} error={error} />)

    expect(wrapper).to.containMatchingElement(<div>Une erreur est survenue : Sorry….</div>)
  })

  it('should display the underlying component when everything is ok', () => {
    const child = <div>Finally!</div>
    const wrapper = shallow(<Loader isLoading={false}>{child}</Loader>)

    expect(wrapper).to.contain(child)
  })
})
