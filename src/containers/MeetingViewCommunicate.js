
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {VideoCombo} from 'components'

class MeetingHome extends Component {
  render() {
    let {localSource, remoteSource, videoEnabled} = this.props
    let remoteAudioMuted = false
    let localVideoDisabled = !videoEnabled
    let props = {localSource, remoteSource, remoteAudioMuted, localVideoDisabled}
    return (
      <div className='MeetingHome'>
        <VideoCombo {...props}/>
      </div>
    )
  }
}

export default connect((state) => ({
  localSource: state.meeting.media.localSource,
  remoteSource: state.meeting.media.remoteSource,
  videoEnabled: state.meeting.media.videoEnabled,
}))(MeetingHome)
