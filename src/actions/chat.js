
import {NotificationManager} from 'react-notifications'

import {
  SEND_MESSAGE_START,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
  TOGGLE_CHAT,
  CLEAR_NOTIFICATIONS,
} from './constants'

export function sendTextMessage(body) {
  return (dispatch, getState) => {
    let {room} = getState().meeting.context
    if (!room) {
      NotificationManager.error('Error sending message: not in a room')
      dispatch({type: SEND_MESSAGE_ERROR, error: new Error('Not in a room')})
    }
    dispatch({type: SEND_MESSAGE_START, body})
    room.send('m.room.message', {body, msgtype: 'm.text'})
      .then(() => {
        dispatch({type: SEND_MESSAGE_SUCCESS, body})
      })
      .catch((error) => {
        cct.log.error('meeting', 'Failed to send message: ', error)
        let msg = (error.error || error.message || error)
        NotificationManager.error('Error sending message: ' + msg)
        dispatch({type: SEND_MESSAGE_ERROR, error})
      })
  }
}

export function toggleChat() {
  return {type: TOGGLE_CHAT}
}

export function clearNotifications() {
  return {type: CLEAR_NOTIFICATIONS}
}
