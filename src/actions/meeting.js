
import {createEventConduit} from './utils'
import {setMeetingConduits} from './conduits'

import {
  MEDIA_SOURCE_NAME,
  SCREEN_SOURCE_NAME,
  STATE_EDITOR_FILE,
} from 'modules/constants'

import {
  SELECT_MEETING_VIEW,
  SELECT_EDITOR_FILE,

  FILE_SHARE_ADD_FILES,
  SIGNED_SHARE_ADD_FILES,

  SET_MEETING_CONTEXT,
  SET_LOCAL_MEDIA_SOURCE,
  ON_SHOW_MEETING_MODAL,
} from './constants'

export function selectView(viewId) {
  return (dispatch, getState) => {
    let {stateSyncData, role} = getState().meeting.stateSync
    if (role === 'advisor' && viewId !== 'leave') {
      stateSyncData.set('view', viewId)
      dispatch({type: SELECT_MEETING_VIEW, viewId})
    }
    if (viewId === 'leave') {
      dispatch({type: ON_SHOW_MEETING_MODAL, showModal: true})
    }
  }
}

export function hideModal() {
  return (dispatch, getState) => {
    dispatch({type: ON_SHOW_MEETING_MODAL, showModal: false})
  }
}

export function selectEditorFile(fileRef) {
  return (dispatch, getState) => {
    let {meeting} = getState()
    let {stateSyncData} = meeting.stateSync
    if (fileRef) {
      stateSyncData.set(STATE_EDITOR_FILE, null)
      stateSyncData.set(STATE_EDITOR_FILE, fileRef.name)
    } else {
      stateSyncData.delete(STATE_EDITOR_FILE)
    }
  }
}

export function fileShareAddFiles(fileRefs) {
  return {type: FILE_SHARE_ADD_FILES, fileRefs}
}

export function fileShareRemoveFile(fileRef) {
  return (dispatch, getState) => {
    let {meeting} = getState()
    let {fileShareData} = meeting.fileShare
    if ({fileShareData}) {
      fileShareData.delete(fileRef.name)
    }
    let {stateSyncData} = meeting.stateSync
    if (fileRef.name === stateSyncData.get(STATE_EDITOR_FILE)) {
      stateSyncData.set(STATE_EDITOR_FILE, null)
    }
  }
}

export function addSignedDocument(fileRef) {
  console.log('adding signed document: ', fileRef)
  return {type: SIGNED_SHARE_ADD_FILES, fileRefs: [fileRef]}
}

export function leaveMeeting() {
  return (dispatch, getState) => {
    let state = getState()
    console.log('LEAVE')
    if (state.meeting.context.call) {
      console.log('HANGUP')
      state.meeting.context.call.close()
    }
    setMeetingConduits(dispatch, {})
    dispatch({type: SET_MEETING_CONTEXT})
  }
}

export function setMeetingContext({role, room, call}) {
  window.room = room
  window.call = call
  cct.log.info('meeting', 'set call context: ', role, room, call)
  return (dispatch, getState) => {
    let state = getState()

    let remoteSource = null
    let remoteScreenSource = null
    let stateSyncData = null
    let fileShareData = null
    let signedShareData = null

    if (call) {
      remoteSource = call.getRemoteSource(MEDIA_SOURCE_NAME)
      remoteScreenSource = call.getRemoteSource(SCREEN_SOURCE_NAME)

      fileShareData = setupFileShare(call, state, role)
      stateSyncData = setupStateSync(call, state, role)
      signedShareData = setupSignedShare(call, state, role)
    }

    let context = {
      role,
      room,
      call,
      stateSyncData,
      fileShareData,
      signedShareData,
      remoteSource,
      remoteScreenSource,
    }

    setMeetingConduits(dispatch, context)
    dispatch({type: SET_MEETING_CONTEXT, ...context})
  }
}

function setupStateSync(call, state, role) {
  let data = new cct.DataShare()
  call.attach('state-sync', data)
  let {view, editorFile} = state.meeting.stateSync
  if (role === 'advisor') {
    data.set('view', view)
  }
  if (editorFile) {
    data.set(STATE_EDITOR_FILE, editorFile.name)
  } else {
    data.delete(STATE_EDITOR_FILE)
  }
  return data
}

function setupFileShare(call, state, role) {
  let files = new cct.FileShare()
  call.attach('file-share', files)
  state.meeting.fileShare.fileRefs.forEach((fileRef) => {
    files.set(fileRef.name, fileRef)
  })
  return files
}

function setupSignedShare(call, state, role) {
  let files = new cct.FileShare()
  call.attach('signed-share', files)
  state.meeting.fileShare.fileRefs.forEach((fileRef) => {
    files.set(fileRef.name, fileRef)
  })
  return files
}
