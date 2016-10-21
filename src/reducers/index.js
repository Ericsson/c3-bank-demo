
import {combineReducers} from 'redux'
import meeting from './meeting'

import {
  SET_SCREEN_LAYOUT,
} from 'actions'

export function layout(state = {}, action) {
  switch (action.type) {
    case SET_SCREEN_LAYOUT:
      return {...state, screenLayout: action.screenLayout}
    default:
      return state
  }
}

export default combineReducers({
  meeting,
  layout,
})
