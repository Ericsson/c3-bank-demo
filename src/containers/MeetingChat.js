
import React from 'react'
import {connect} from 'react-redux'
import {Chat} from 'components'
import {sendTextMessage} from 'actions'

function createChatEventFilter() {
  let oldEvents = []
  let oldLength = 0
  return function chatEventFilter(events) {
    if (oldLength !== events.length) {
      oldEvents = events.filter((event) => event.type === 'm.room.message').reverse()
      oldLength = events.length
    }
    return oldEvents
  }
}

const messagesFilter = createChatEventFilter()

export default connect((state) => ({
  messages: messagesFilter(state.meeting.chat.events),
}), (dispatch) => ({
  onSendMessage: (body) => dispatch(sendTextMessage(body)),
}))(Chat)
