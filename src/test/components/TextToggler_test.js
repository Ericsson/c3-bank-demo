
import React from 'react'
import {TOGGLE_COLOR} from 'actions'
import configureStore from '../configureStore'
import {TextToggler} from 'containers'
import {Provider} from 'react-redux'
import {expect} from 'chai'
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate,
} from 'react-addons-test-utils'

describe('TextToggler', () => {
  it('should render the current text state', () => {
    const store = configureStore({
      text: 'Hello',
      color: '#f00',
    })
    const component = renderIntoDocument(
      <Provider store={store}>
        <TextToggler />
      </Provider>
    )

    const text = findRenderedDOMComponentWithClass(component, 'Text')
    expect(text.textContent).to.equal('Hello')
  })

  it('should dispatch a toggle color action when clicked', () => {
    const store = configureStore({
      text: 'Hello',
      color: '#f00',
    })
    const component = renderIntoDocument(
      <Provider store={store}>
        <TextToggler />
      </Provider>
    )

    store.clearActions()
    const text = findRenderedDOMComponentWithClass(component, 'Text')
    Simulate.click(text)

    const actions = store.getActions()
    expect(actions.length).to.equal(1)
    expect(actions[0].type).to.equal(TOGGLE_COLOR)
  })
})
