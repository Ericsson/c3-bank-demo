
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import registerGlobalDispatchers from './globalDispatchers'

const enhancer = applyMiddleware(thunk)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)
  registerGlobalDispatchers(store)

  return store
}
