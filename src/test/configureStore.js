
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

export default function configureStore(initialState) {
  return createMockStore([thunk])(initialState)
}
