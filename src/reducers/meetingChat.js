
import {
  SET_MEETING_CONTEXT,
  ROOM_EVENT,
  TOGGLE_CHAT,
  CLEAR_NOTIFICATIONS,
} from 'actions'

const showStateStorageKey = 'state.meeting.chat.show'

let oldShowState = localStorage.getItem(showStateStorageKey)
if (oldShowState) {
  try {
    oldShowState = JSON.parse(oldShowState)
  } catch (error) {}
}

if (typeof(oldShowState) !== 'boolean') {
  oldShowState = true
}

const initialState = {
  events: [],
  filteredEvents: [],
  show: oldShowState,
  readCount: 0,
  unreadCount: 0,
}

export default function chat(state = initialState, action) {
  switch (action.type) {
    case SET_MEETING_CONTEXT:
      let {room} = action
      if (room) {
        room.load(1000)
      }
      return state
    case ROOM_EVENT:
      switch (action.event) {
        case 'events':
          if (action.args[0]) {
            let events = action.args[0]
              .filter((event) => event.type === 'm.room.message')
              .filter((event) => client.user.id !== event.sender.id)
              .filter((event) => !event.isPastEvent)
            let filteredEvents = events
            let unread = events.length - state.readCount
            if (state.show) { // If chat is open, clear incoming notifications
              unread = 0;
              state.readCount = filteredEvents.length;
            }
            return {...state, events: action.args[0], unreadCount: unread, filteredEvents: filteredEvents}
          }
          return {...state, events: action.args[0]}
        default:
          return state
      }
    case TOGGLE_CHAT:
      let show = !state.show
      localStorage.setItem(showStateStorageKey, JSON.stringify(show))
      return {...state, show}
    case CLEAR_NOTIFICATIONS:
      return {...state, unreadCount: 0, readCount: state.filteredEvents.length}
    default:
      return state
  }
}
