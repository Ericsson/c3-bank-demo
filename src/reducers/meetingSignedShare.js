
import {
  SET_MEETING_CONTEXT,
  SIGNED_SHARE_ADD_FILES,
  SIGNED_SHARE_EVENT,
} from 'actions'

const initialState = {
  fileRefs: [],
  signedShareData: null,
}

export default function signedShare(state = initialState, action) {
  function getSignedShareDataSignedRefs(data) {
    return [...data.values()].filter((file) => file)
  }

  switch (action.type) {
    case SET_MEETING_CONTEXT: {
      let {signedShareData} = action
      if (!signedShareData) {
        return initialState
      }
      let fileRefs = getSignedShareDataSignedRefs(signedShareData)
      return {signedShareData, fileRefs}
    }
    case SIGNED_SHARE_ADD_FILES: {
      let {signedShareData} = state
      if (signedShareData) {
        action.fileRefs.forEach((fileRef) => {
          signedShareData.set(fileRef.name, fileRef)
        })
      }
      return state
    }
    case SIGNED_SHARE_EVENT: {
      if (action.event === 'unsubscribe') {
        return state
      }
      let {signedShareData} = state
      let fileRefs = getSignedShareDataSignedRefs(signedShareData)
      fileRefs.forEach((fileRef) => {
        if (!fileRef.isLocal && !(fileRef.progress > 0) && !fileRef.file) {
          fileRef.fetch()
            .catch((error) => cct.log.error('meeting', 'Failed file ref fetch:', error))
        }
      })
      return {...state, fileRefs}
    }
    default:
      return state
  }
}
