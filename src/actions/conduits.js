
import {createEventConduit} from './utils'

import {
  ROOM_EVENT,
  PEER_EVENT,
  CALL_EVENT,
  STATE_SYNC_EVENT,
  FILE_SHARE_EVENT,
  SIGNED_SHARE_EVENT,
  EDIT_SYNC_EVENT,
} from './constants'

import {
  STATE_EDITOR_FILE,
} from 'modules/constants'

let roomConduit = createEventConduit([
  'events',
  'name',
  'topic',
  'members',
  'typing',
], function (dispatch, event, args) {
  if (event === 'events') {
    dispatch({type: ROOM_EVENT, event, args: [this.events]})
  } else {
    dispatch({type: ROOM_EVENT, event, args})
  }
})

let peerConduit = createEventConduit([
  'name',
  'avatar',
], (dispatch, event, args) => dispatch({type: PEER_EVENT, event, args}))

let callConduit = createEventConduit([
  'connected',
  'stopped',
  'closed',
  'peer',
], (dispatch, event, args) => {
  dispatch({type: CALL_EVENT, event, args})
  if (event === 'peer') {
    let [peer] = args
    peerConduit.connect(peer, dispatch)
  }
})

let stateSyncConduit = createEventConduit([
  'update',
], (dispatch, event, [update]) => {
  dispatch({type: STATE_SYNC_EVENT, event, update})
})

let fileShareConduit = createEventConduit([
  'update',
], (dispatch, event, [update]) => dispatch({type: FILE_SHARE_EVENT, event, update}))

let signedShareConduit = createEventConduit([
  'update',
], (dispatch, event, [update]) => dispatch({type: SIGNED_SHARE_EVENT, event, update}))

export function setMeetingConduits(dispatch, context) {
  let {
    role,
    room,
    call,
    stateSyncData,
    fileShareData,
    signedShareData,
  } = context

  roomConduit.connect(room, dispatch)
  callConduit.connect(call, dispatch)

  if (!call) {
    peerConduit.connect(null, dispatch)
    stateSyncConduit.connect(null, dispatch)
    fileShareConduit.connect(null, dispatch)
    signedShareConduit.connect(null, dispatch)
    return
  }

  stateSyncConduit.connect(stateSyncData, dispatch)
  fileShareConduit.connect(fileShareData, dispatch)
  signedShareConduit.connect(signedShareData, dispatch)
}
