import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './store/configureStore'
import configureClient from './store/configureClient'
import {hashHistory} from 'react-router'
import '../node_modules/react-notifications/lib/notifications.css'
import './styles/index.scss'

const store = configureStore()
const root = document.createElement('div')
document.body.appendChild(root)

const client = configureClient()

let render = () => {
  const Root = require('./containers/Root').default
  ReactDOM.render(
    <Root store={store} history={hashHistory} client={client} />
  , root)
}

// Hot reload support, https://github.com/reactjs/redux/pull/1455/files
if (module.hot) {
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react')
    ReactDOM.render(<RedBox error={error} />, root)
  }
  render = () => {
    try {
      renderApp()
    } catch (error) {
      console.error(error)
      renderError(error)
    }
  }
  module.hot.accept('./containers/Root', () => {
    setTimeout(render)
  })
}

render()
