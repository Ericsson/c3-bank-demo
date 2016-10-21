
import React, {PropTypes} from 'react'
import {Provider} from 'react-redux'
import {ClientProvider, Routes} from 'containers'

const Root = ({client, store, history}) => (
  <ClientProvider client={client}>
    <Provider store={store}>
      <div className='Root'>
        <Routes history={history} />
      </div>
    </Provider>
  </ClientProvider>
)

Root.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

export default Root
