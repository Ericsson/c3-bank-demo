
import React from 'react'
import {connect} from 'react-redux'
import CallControls from 'components/CallControls'
import {toggleAudio, toggleVideo, toggleChat} from 'actions'

export default connect((state) => ({
  audioEnabled: state.meeting.media.audioEnabled,
  videoEnabled: state.meeting.media.videoEnabled,
  chatEnabled: state.meeting.chat.show,
  horizontal: true,
}), (dispatch) => ({
  onAudioToggle: () => dispatch(toggleAudio()),
  onVideoToggle: () => dispatch(toggleVideo()),
  onChatToggle: () => dispatch(toggleChat()),
}))(CallControls)
