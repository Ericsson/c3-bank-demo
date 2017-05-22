
import {
  screenSharingFrameRate,
  chromeExtensionId,
  firefoxExtensionUrl,
  firefoxExtensionHash,
} from 'modules/config'

import downloadFile from 'modules/downloadFile'

import {
  SET_LOCAL_MEDIA_SOURCE,
  SET_LOCAL_SCREEN_SOURCE,
  SET_SCREEN_SHARING_STATUS,

  TOGGLE_AUDIO,
  TOGGLE_VIDEO,

  TOGGLE_RECORDING,
  SET_LOCAL_RECORDER_SOURCE,
} from './constants'

export function setLocalMediaSource(localSource) {
  return {type: SET_LOCAL_MEDIA_SOURCE, localSource}
}

export function toggleAudio() {
  return {type: TOGGLE_AUDIO}
}

export function toggleVideo() {
  return {type: TOGGLE_VIDEO}
}

export function startScreenSharing() {
  return (dispatch, getState) => {
    let media = getState().meeting.media
    if (media.localScreenSource) {
      cct.log.debug('meeting', 'ignored request to start screen sharing when already active')
      return
    }

    let localScreenSource = new cct.ScreenSource({
      chromeExtensionId,
      frameRate: screenSharingFrameRate,
    })
    dispatch({type: SET_LOCAL_SCREEN_SOURCE, localScreenSource})

    localScreenSource.promise.catch((error) => {
      var notInstalledChrome = error === 'not installed'
      var notInstalledFirefox = error.name === 'PermissionDeniedError' || error.name === 'SecurityError'
      if (notInstalledChrome || notInstalledFirefox) {
        showInlineInstall()
        dispatch({
          type: SET_SCREEN_SHARING_STATUS,
          status: 'need-install',
          message: 'Screen sharing failed, need to install extension',
        })
      } else {
        dispatch({
          type: SET_SCREEN_SHARING_STATUS,
          status: 'failed',
          message: 'Screen sharing failed: ' + error,
        })
      }
      dispatch({type: SET_LOCAL_SCREEN_SOURCE, localScreenSource: null})
      throw error
    }).then(() => {
      dispatch({
        type: SET_SCREEN_SHARING_STATUS,
        status: 'active',
        message: 'Screen sharing is active',
      })
    }).catch((error) => cct.log.error('meeting', 'screen sharing failed: ' + error))
  }
}

export function stopScreenSharing() {
  return (dispatch, getState) => {
    let media = getState().meeting.media
    if (!media.localScreenSource) {
      cct.log.debug('meeting', 'ignored request to stop screen sharing when already inactive')
      return
    }
    dispatch({type: SET_LOCAL_SCREEN_SOURCE, localScreenSource: null})
    dispatch({
      type: SET_SCREEN_SHARING_STATUS,
      status: 'inactive',
      message: 'Screen sharing is inactive',
    })
  }
}

export function toggleRecording() {
  return (dispatch, getState) => {
    let media = getState().meeting.media
    let {stateSyncData} = getState().meeting.stateSync
    let {recorderMediaSource, localSource, remoteSource} = media
    if(recorderMediaSource) {
      stateSyncData.set('recording', false)
      dispatch({type: SET_LOCAL_RECORDER_SOURCE, localScreenSource: null})
    } else {
      let localRecorderSource = new cct.ScreenSource({
        chromeExtensionId,
        frameRate: screenSharingFrameRate,
      })

      let recorder = new cct.Recorder()
      let downloaded = false
      recorder.on('blob', (blob) => {
        blob.name = `recording-${new Date().toISOString()}.webm`
        if (downloaded) {
          return
        }
        downloaded = true
        downloadFile(blob)
      })

      let audioMixer = new cct.AudioMixer()
      let streamMerger = new cct.StreamMerger()
      audioMixer.connect(streamMerger.audioInput)
      localRecorderSource.connect(streamMerger.videoInput)

      localSource.connect(audioMixer.inputs.get('local'))
      remoteSource.connect(audioMixer.inputs.get('remote'))

      localRecorderSource.once('stream', (stream) => {
        streamMerger.connect(recorder)
      })

      stateSyncData.set('recording', true)
      dispatch({type: SET_LOCAL_RECORDER_SOURCE, recorderMediaSource: localRecorderSource})
    }
  }
}

function showInlineInstall() {
  if (window.chrome) {
    let url = `https://chrome.google.com/webstore/detail/${chromeExtensionId}`
    window.chrome.webstore.install(url, () => {
      cct.log.info('meeting', 'inline install returned')
    }, error => {
      log.error('meeting', 'extension installation failed:', error)
    })
  } else {
    window.InstallTrigger.install({
      'app': {
        URL: firefoxExtensionUrl,
        Hash: firefoxExtensionHash,
        toString: function () {
          return this.URL
        },
      },
    })
  }
}
