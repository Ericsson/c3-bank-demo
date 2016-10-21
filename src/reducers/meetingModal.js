

import {
  ON_SHOW_MEETING_MODAL,
  SET_MEETING_CONTEXT,
} from 'actions'

const initialState = {
  showModal: false,
}

export default function toggleModal(state = initialState, action) {
  switch (action.type) {
    case ON_SHOW_MEETING_MODAL: {
      let {showModal} = action
      return {...state, showModal}
    }
    case SET_MEETING_CONTEXT:
      return initialState
    default:
      return state
  }
}
