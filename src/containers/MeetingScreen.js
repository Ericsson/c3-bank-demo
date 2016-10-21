
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {SplitContainer} from 'components'
import {
  AdvisorSidebar,
  CustomerSidebar,
  CustomerLandingPage,
  MeetingChat,
  MeetingViewCollaborate,
  MeetingViewCommunicate,
  MeetingViewLeave,
  MeetingViewPresent,
} from 'containers'

function getSidebar({role}) {
  if (role === 'advisor') {
    return <AdvisorSidebar/>
  } else if (role === 'customer') {
    return <CustomerSidebar />
  }
}

function getView({viewId, role, hasConnected}) {
  if (role === 'customer' && !hasConnected) {
    return <CustomerLandingPage />
  }
  switch (viewId) {
    case 'communicate':
      return <MeetingViewCommunicate />
    case 'present':
      return <MeetingViewPresent />
    case 'collaborate':
      return <MeetingViewCollaborate />
    default:
      cct.log.error('meeting', 'failed to get view for ' + viewId)
      return null
  }
}

const MeetingScreen = ({isFileOver, showChat, ...props}) => (
  <div className={`MeetingScreen ${isFileOver ? 'MeetingScreen-file-over' : ''}`}>
    {getView(props)}
    {getSidebar(props)}
    {showChat && <MeetingChat/>}
  </div>
)

MeetingScreen.propTypes = {
  children: PropTypes.element,
}

export default connect((state) => ({
  viewId: state.meeting.stateSync.view,
  role: state.meeting.context.role,
  isFileOver: state.meeting.fileShare.isOver,
  room: state.meeting.context.call.room,
  showChat: state.meeting.chat.show,
  hasConnected: state.meeting.context.callHasConnected,
}))(MeetingScreen)
