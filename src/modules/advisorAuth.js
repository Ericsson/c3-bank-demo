
import {serverUrl} from 'modules/config'

const AUTH_INFO_KEY = 'webmeeting-advisor-session'
const advisorSessionStorage = localStorage

function saveAuthInfo(authInfo) {
  advisorSessionStorage.setItem(AUTH_INFO_KEY, JSON.stringify(authInfo))
}

function loadAuthInfo() {
  let json = advisorSessionStorage.getItem(AUTH_INFO_KEY)
  try {
    return JSON.parse(json)
  } catch (error) {
    cct.log.error('meeting', 'failed to parse auth info: ' + error)
    return null
  }
}

export function trySavedSession(client) {
  return Promise.resolve().then(() => {
    let authInfo = loadAuthInfo()
    if (!authInfo) {
      throw new Error('No saved session')
    }
    return client.auth(authInfo)
  })
}

export function loginWithPassword(client, username, password) {
  return cct.Auth.loginWithPassword({
    serverUrl, username, password,
  })
    .then(client.auth)
    .then(() => {
      saveAuthInfo(client.authInfo)
    })
}

export function logout(client) {
  cct.log.info('meeting', 'logging out')
  advisorSessionStorage.removeItem(AUTH_INFO_KEY)
  client.logout()
}

export function isAuthenticated(client) {
  // TODO use isAdvisor and prepend advisor to advisor user ids
  return !!client.authInfo && !!client.user.name
}

export function register(client, fullname, username, password) {
  var options = {
    serverUrl: serverUrl,
    username: username,
    password: password,
  }
  cct.log.info('Register', 'About to register user: ' + username)

  let name = username

  return cct.Auth.registerWithPassword(options).then(function (info) {
    cct.log.info('Register', 'Successfully registered user with id: ' + info.userId)
    cct.log.info('Client', 'Signing in user')

    loginWithPassword(client, username, password).then(function () {
      client.setName(name)
    }).catch(function (error) {
      cct.log.error('Error', error)
    })
  })
}
