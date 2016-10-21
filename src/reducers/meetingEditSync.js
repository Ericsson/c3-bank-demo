
import {
  SET_MEETING_CONTEXT,
  STATE_SYNC_EVENT,
} from 'actions'

import {
  STATE_EDITOR_FILE,
} from 'modules/constants'

const initialState = {
  currentData: null,
  currentFile: null,
}

export default function editSync(state = initialState, action) {
  switch (action.type) {
    case SET_MEETING_CONTEXT: {
      let {call} = action
      if (!call) {
        return initialState
      }
      let currentData = getEditDataForState(state)
      return {...state, call, currentData}
    }
    case STATE_SYNC_EVENT: {
      if (action.event === 'unsubscribe') {
        return state
      }
      let {key, value} = action.update
      if (key !== STATE_EDITOR_FILE) {
        return state
      }
      let currentFile = value || null
      let currentData = getEditDataForState({...state, currentFile})
      return {...state, currentFile, currentData}
    }
    default:
      return state
  }
}

const datas = {}

function getEditDataForState({call, currentFile}) {
  if (!call || !currentFile) {
    return null
  }
  let name = `edit-data-${currentFile.name}`
  let data = datas[name]
  if (!data) {
    data = new cct.DataShare()
    call.attach(name, data)
    datas[name] = data
  }
  return data
}
