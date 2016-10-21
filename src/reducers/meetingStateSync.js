
import {STATE_EDITOR_FILE} from 'modules/constants'

import {
  SET_MEETING_CONTEXT,
  SELECT_MEETING_VIEW,
  STATE_SYNC_EVENT,
} from 'actions'

const defaultView = 'communicate'

const initialState = {
  view: defaultView,
  editorFile: null,
  stateSyncData: null,
  fileShareData: null,
  role: null,
  recording: false,
}

export default function stateSync(state = initialState, action) {
  switch (action.type) {
    case SET_MEETING_CONTEXT: {
      let {role, stateSyncData, fileShareData} = action
      let view = defaultView
      return {...state, view, role, stateSyncData, fileShareData}
    }
    case SELECT_MEETING_VIEW: {
      let {viewId} = action
      return {...state, view: viewId}
    }
    case STATE_SYNC_EVENT: {
      if (action.event === 'unsubscribe') {
        return state
      }
      let {role} = state
      let {key, value} = action.update
      switch (key) {
        case 'view':
          return {...state, view: value}
        case STATE_EDITOR_FILE:
          let fileName = value
          let fileRef = state.fileShareData && state.fileShareData.get(fileName)
          return {...state, editorFile: fileRef || null}
        case 'recording':
          return {...state, recording: value}
        default:
          return state
      }
    }
    default:
      return state
  }
}
