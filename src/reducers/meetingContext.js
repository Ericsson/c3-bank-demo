
import {SET_MEETING_CONTEXT, CALL_EVENT} from 'actions'

const initialState = {
  room: null,
  call: null,
  role: null,
  callHasConnected: false,
}

export default function context(state = initialState, action) {
  switch (action.type) {
    case SET_MEETING_CONTEXT: {
      let {room, call, role} = action
      if (!room) {
        return initialState
      }
      return {room, call, role}
    }
    case CALL_EVENT: {
      if (action.event === 'connected') {
        return {...state, callHasConnected: true}
      }
    }
    default:
      return state
  }
}
