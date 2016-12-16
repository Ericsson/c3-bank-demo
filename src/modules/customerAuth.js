
import {serverUrl} from 'modules/config'
import {ADVISOR_ENTER_EVENT} from 'modules/constants'

const AUTH_INFO_KEY = 'webmeeting-customer-session'
const advisorSessionStorage = sessionStorage

function saveAuthInfo(authInfo) {
  advisorSessionStorage.setItem(AUTH_INFO_KEY, JSON.stringify(authInfo))
}

function loadAuthInfo() {
  let json = advisorSessionStorage.getItem(AUTH_INFO_KEY)
  if (!json) {
    throw new Error('need auth')
  }
  try {
    return JSON.parse(json)
  } catch (error) {
    cct.log.error('meeting', 'failed to parse auth info: ' + error)
    throw new Error('need auth')
  }
}

export function bootstrapCustomer(client, meetingId) {
  return Promise.resolve()
    .then(() => {
      cct.log.info('meeting', 'authenticating with existing session')
      return client.auth(loadAuthInfo())
    })
    .catch(() => {
      return cct.Auth.guest({serverUrl})
        .then((authInfo) => {
          cct.log.info('meeting', `customer authenticated as ${client.user}`)
          saveAuthInfo(authInfo)
          return client.auth(authInfo)
        })
        .catch((error) => {
          cct.log.error('meeting', 'Failed to connect to authentication server: ' + error)
          throw new Error('Failed to connect to authentication server')
        })
    })
    .then(() => {
      cct.log.info('meeting', `joining meeting ${meetingId}`)
      return client.getRoom(meetingId).join()
        .catch((error) => {
          cct.log.error('meeting', 'Failed to join meeting: ' + error)
          throw new Error('Failed to join meeting')
        })
    })
    .then((room) => {
      let creationEvent = room.state('m.room.create').get()
      if (!creationEvent) {
        cct.log.error('meeting', 'meeting room has not creation event')
        this.setState({loading: false, error: new Error('Meeting initialization error')})
        return
      }
      let creator = creationEvent.creator
      cct.log.info('meeting', `starting call to ${creator}`)
      let call = room.startCall(creator)
      room.on(`event:${ADVISOR_ENTER_EVENT}`, function () {
        cct.log.info('meeting', `got advisor enter event, restarting call to ${creator}`)
        call.start()
      })
      return {room, call}
    })
}

export function isAuthenticated(client) {
  // TODO use isAdvisor and prepend advisor to advisor user ids
  return !!client.authInfo && !client.user.name
}
