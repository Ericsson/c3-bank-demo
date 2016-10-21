
import React, {PropTypes} from 'react'
import {Icon, IconStack} from 'components'
import {MeetingChatToggle} from 'containers'

function itemClasses(enabled) {
  return `CallControls-item ${enabled ? '' : 'CallControls-item-off'} fa-stack fa-2x`
}

const CallControls = ({
  audioEnabled,
  onAudioToggle,
  videoEnabled,
  onVideoToggle,
  chatEnabled,
  onChatToggle,
  horizontal = true,
}) => {
  return (
    <div className='CallControls'>
      <MeetingChatToggle/>
      <span className={itemClasses(audioEnabled)} onClick={onAudioToggle}>
        <Icon className='CallControls-secondary' name='circle' stack='2x' />
        <Icon name={`microphone${audioEnabled ? '' : '-slash'}`} className='CallControls-primary' stack='1x' />
      </span>
      <span className={itemClasses(videoEnabled)} onClick={onVideoToggle}>
        <Icon className='CallControls-secondary' name='circle' stack='2x' />
        <Icon name={`video-camera${videoEnabled ? '' : ''}`} className='CallControls-primary' stack='1x' />
      </span>
    </div>
  )
}

CallControls.propTypes = {
  audioEnabled: PropTypes.bool.isRequired,
  onAudioToggle: PropTypes.func.isRequired,
  videoEnabled: PropTypes.bool.isRequired,
  onVideoToggle: PropTypes.func.isRequired,
  horizontal: PropTypes.bool,
}

export default CallControls
