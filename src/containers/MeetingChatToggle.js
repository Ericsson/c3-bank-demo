
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {toggleChat, clearNotifications} from 'actions'
import {Icon, UnreadNotification} from 'components'
import {MeetingChat} from 'containers'

function itemClasses(enabled) {
  return `MeetingChatToggle ${enabled ? '' : 'MeetingChatToggle-off'} fa-stack fa-2x`
}


const MeetingChatToggle = ({show, unreadCount, toggleChat, clearNotifications}) => (
  <span>
    <span className={itemClasses(show)} onClick={() => {
        toggleChat()
        !show && clearNotifications()
      }}>
      {!show && !!unreadCount && <UnreadNotification unreadCount={unreadCount}/>}
      <Icon className='MeetingChatToggle--background' name='circle' stack='2x' />
      <Icon name={`comments${show ? '' : '-o'}`} className='MeetingChatToggle--icon' stack='1x' />
    </span>
  </span>
)

export default connect((state) => ({
  show: state.meeting.chat.show,
  unreadCount: state.meeting.chat.unreadCount
}), (dispatch) => ({
  toggleChat: () => dispatch(toggleChat()),
  clearNotifications: () => dispatch(clearNotifications()),
}))(MeetingChatToggle)
