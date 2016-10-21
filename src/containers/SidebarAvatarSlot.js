
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Avatar, Video} from 'components'
import defaultAvatar from '../images/default_user.png'

const SidebarAvatarSlot = ({selectedView, remoteSource, peer}) => {
  if (selectedView === 'communicate') {
    return (
      <div className='SidebarAvatarSlot SidebarAvatarSlot-avatar'>
        <Avatar user={peer} size={120} defaultAvatarUrl={defaultAvatar}/>
      </div>
    )
  } else {
    return (
      <div className='SidebarAvatarSlot SidebarAvatarSlot-video'>
        <Video source={remoteSource} />
      </div>
    )
  }
}

SidebarAvatarSlot.propTypes = {
  selectedView: PropTypes.string,
  remoteSource: PropTypes.object,
  peer: PropTypes.object,
}

function getPeer(call) {
  if (call) {
    return call.peer
  } else {
    return null
  }
}

export default connect((state) => ({
  selectedView: state.meeting.stateSync.view,
  remoteSource: state.meeting.media.remoteSource,
  peer: getPeer(state.meeting.context.call),
}))(SidebarAvatarSlot)
