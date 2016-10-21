
import {createStore, applyMiddleware, compose} from 'redux'
import {persistState} from 'redux-devtools'
import thunk from 'redux-thunk'
// import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import registerGlobalDispatchers from './globalDispatchers'
// Don't import from containers index, since that will break hot reloading
import DevTools from '../containers/DevTools'

const enhancer = compose(
  applyMiddleware(thunk/*, createLogger()*/),
  DevTools.instrument(),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&#]+)\b/
    )
  )
)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)
  registerGlobalDispatchers(store)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default)
    })
  }

  window.store = store

  return store
}
