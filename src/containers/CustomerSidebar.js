
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {selectView} from 'actions'
import {Clock, Username, ViewIconRow, Logo, ViewIcon, Pulse} from 'components'
import {MeetingCallControls, SidebarAvatarSlot, MeetingChatToggle, MeetingViewLeave} from 'containers'
import {appIcons} from 'modules/config'

class CustomerSidebar extends Component {
  static contextTypes = {
    client: PropTypes.object,
  }
  render() {
    let {advisor, hasConnected, isRecording, ...iconRowProps} = this.props

    let avatarSlot = null

    let viewIconProps = {
      selectedView: this.props.selectedView,
      onSelectView: this.props.onSelectView,
    }
    let leaveModal;
    if(this.props.showModal) {
      leaveModal = <MeetingViewLeave/>
    }
    return (
      <div className='CustomerSidebar Sidebar'>
        <SidebarAvatarSlot/>
        <Username user={advisor}/>
        <MeetingCallControls/>
        {hasConnected && <ViewIcon {...viewIconProps} {...appIcons.communicate}/>}
        {hasConnected && <ViewIcon {...viewIconProps} {...appIcons.present}/>}
        {hasConnected && <ViewIcon {...viewIconProps} {...appIcons.collaborate}/>}
        <div className='Sidebar--spacing'/>
        {leaveModal}
        {isRecording &&  <Pulse />}
        <ViewIcon {...viewIconProps} {...appIcons.leave}/>
        <Clock/>
      </div>
    )
  }
}

function getMeetingCreator(room) {
  if (room) {
    return room.getCreator()
  } else {
    return null
  }
}

export default connect((state) => ({
  advisor: getMeetingCreator(state.meeting.context.room),
  selectedView: state.meeting.stateSync.view,
  peerSelectedView: state.meeting.stateSync.peerView,
  hasConnected: state.meeting.context.callHasConnected,
  showModal: state.meeting.toggleModal.showModal,
  isRecording: state.meeting.stateSync.recording
}), (dispatch) => ({
  onSelectView: (id) => dispatch(selectView(id)),
}))(CustomerSidebar)
