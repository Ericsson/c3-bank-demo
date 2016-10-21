
import {combineReducers} from 'redux'

import context from './meetingContext'
import media from './meetingMedia'
import stateSync from './meetingStateSync'
import chat from './meetingChat'
import fileShare from './meetingFileShare'
import signedShare from './meetingSignedShare'
import editSync from './meetingEditSync'
import toggleModal from './meetingModal'

export default combineReducers({
  context,
  media,
  stateSync,
  chat,
  fileShare,
  signedShare,
  editSync,
  toggleModal,
})
