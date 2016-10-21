
import {MEDIA_SOURCE_NAME, SCREEN_SOURCE_NAME, RECORDER_SOURCE_NAME} from 'modules/constants'

import {
  SET_MEETING_CONTEXT,
  SET_LOCAL_MEDIA_SOURCE,
  SET_LOCAL_SCREEN_SOURCE,
  SET_SCREEN_SHARING_STATUS,
  TOGGLE_AUDIO,
  TOGGLE_VIDEO,
  SET_LOCAL_RECORDER_SOURCE,
} from 'actions'

const initialState = {
  localSource: null,
  remoteSource: null,
  localScreenSource: null,
  remoteScreenSource: null,
  recorderMediaSource: null,
  call: null,
  audioEnabled: true,
  videoEnabled: true,
}

export default function media(state = initialState, action) {
  switch (action.type) {
    case SET_MEETING_CONTEXT: {
      let {call, remoteSource, remoteScreenSource} = action
      let {localSource, localScreenSource} = state
      if (!call) {
        if (localSource) {
          localSource.stop()
        }
        if (localScreenSource) {
          localScreenSource.stop()
        }
        return initialState
      }
      if (call && localSource) {
        call.setLocalSource(MEDIA_SOURCE_NAME, localSource)
        localSource.mute = {
          audio: !state.audioEnabled,
          video: !state.videoEnabled,
        }
      }
      if (call && localScreenSource) {
        call.setLocalSource(SCREEN_SOURCE_NAME, localScreenSource)
      }
      return {...state, call, remoteSource, remoteScreenSource}
    }
    case SET_LOCAL_MEDIA_SOURCE: {
      let {localSource} = action
      if (state.localSource && state.localSource !== localSource) {
        state.localSource.stop()
      }
      let {call} = state
      if (call) {
        call.setLocalSource(MEDIA_SOURCE_NAME, localSource)
        localSource.mute = {
          audio: !state.audioEnabled,
          video: !state.videoEnabled,
        }
      }
      return {...state, localSource}
    }
    case SET_LOCAL_RECORDER_SOURCE: {
      let {recorderMediaSource} = action
      let {call} = state
      if (state.recorderMediaSource) {
        state.recorderMediaSource.stop()
      }
      if (call) {
        call.setLocalSource(RECORDER_SOURCE_NAME, recorderMediaSource)
      }
      return {...state, recorderMediaSource}

    }
    case SET_LOCAL_SCREEN_SOURCE: {
      let {localScreenSource} = action
      let {call} = state
      if (state.localScreenSource) {
        state.localScreenSource.stop()
      }
      if (call) {
        call.setLocalSource(SCREEN_SOURCE_NAME, localScreenSource)
      }
      return {...state, localScreenSource}
    }
    case SET_SCREEN_SHARING_STATUS: {
      let screenSharingStatus = action.status
      let screenSharingMessage = action.message
      return {...state, screenSharingStatus, screenSharingMessage}
    }
    case TOGGLE_AUDIO: {
      let {audioEnabled, localSource} = state
      audioEnabled = !audioEnabled
      if (localSource) {
        localSource.mute.audio = !audioEnabled
      }
      return {...state, audioEnabled}
    }
    case TOGGLE_VIDEO:
      let {videoEnabled, localSource} = state
      videoEnabled = !videoEnabled
      if (localSource) {
        localSource.mute.video = !videoEnabled
      }
      return {...state, videoEnabled}
    default:
      return state
  }
}
