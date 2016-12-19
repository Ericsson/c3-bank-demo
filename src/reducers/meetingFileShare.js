
import {
  SET_MEETING_CONTEXT,
  FILE_SHARE_DRAG_OVER,
  FILE_SHARE_ADD_FILES,
  FILE_SHARE_EVENT,
} from 'actions'

const initialState = {
  fileRefs: [],
  isOver: false,
  fileShareData: null,
  selectedFile: null,
}

export default function fileShare(state = initialState, action) {
  function getFileShareDataFileRefs(data) {
    return [...data.values()].filter((file) => file)
  }

  switch (action.type) {
    case SET_MEETING_CONTEXT: {
      let {fileShareData} = action
      return {
        ...state,
        fileShareData,
        fileRefs: [],
        selectedFile: null,
      }
    }
    case FILE_SHARE_DRAG_OVER: {
      let {isOver} = action
      return {...state, isOver}
    }
    case FILE_SHARE_ADD_FILES: {
      let {fileShareData} = state
      fileShareData.clear()
      action.fileRefs.forEach((fileRef) => {
        fileShareData.set(fileRef.name, fileRef)
      })
      return state
    }
    case FILE_SHARE_EVENT: {
      if (action.event === 'unsubscribe') {
        return state
      }
      let {fileShareData} = state
      let fileRefs = getFileShareDataFileRefs(fileShareData)
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
