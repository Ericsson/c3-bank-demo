
import {iceServers} from 'modules/config'

export default function configureClient() {
  let client = new cct.Client({iceServers})
  window.client = client
  return client
}

cct.User.prototype.isAdvisor = function () {
  return this.id && this.id.startsWith('advisor_')
}
