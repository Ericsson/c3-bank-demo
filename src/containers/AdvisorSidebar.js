
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {selectView, toggleRecording} from 'actions'
import {Clock, Logo, Icon, ViewIcon, Recorder} from 'components'
import {MeetingCallControls, SidebarAvatarSlot, MeetingChatToggle, MeetingViewLeave} from 'containers'
import {appIcons} from 'modules/config'

class AdvisorSidebar extends Component {
  static contextTypes = {
    client: PropTypes.object,
  }
  constructor () {
    super()
  }
  render() {
    let {localScreenSource, isRecording, onRecord} = this.props
    let screenSharingIndicator = null
    if (localScreenSource) {
      screenSharingIndicator = [{
        index: 1,
        element: <Icon name='circle' className='AdvisorSidebar-screen-sharing-indicator'/>
      }]
    }
    let viewIconProps = {
      selectedView: this.props.selectedView,
      onSelectView: this.props.onSelectView,
    }
    let leaveModal;
    if(this.props.showModal) {
      leaveModal = <MeetingViewLeave/>
    }
    return (

      <div className="AdvisorSidebar Sidebar">
        <SidebarAvatarSlot/>
        <MeetingCallControls/>
        <ViewIcon {...viewIconProps} {...appIcons.communicate}/>
        <ViewIcon {...viewIconProps} {...appIcons.present}/>
        <ViewIcon {...viewIconProps} {...appIcons.collaborate}/>
        <div className='Sidebar--spacing'/>
        {leaveModal}
        <Recorder clickHandler={onRecord} isRecording={isRecording} />
        <ViewIcon {...viewIconProps} {...appIcons.leave}/>
        <Clock/>
      </div>
    )
  }
}

export default connect((state) => ({
  selectedView: state.meeting.stateSync.view,
  peerSelectedView: state.meeting.stateSync.peerView,
  localScreenSource: state.meeting.media.localScreenSource,
  showModal: state.meeting.toggleModal.showModal,
  isRecording: state.meeting.stateSync.recording
}), (dispatch) => ({
  onSelectView: (id) => dispatch(selectView(id)),
  onRecord: () => dispatch(toggleRecording()),
}))(AdvisorSidebar)
