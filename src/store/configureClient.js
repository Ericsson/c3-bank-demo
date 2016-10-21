
import {iceServers} from 'modules/config'

export default function configureClient() {
  let client = new cct.Client({iceServers})
  window.client = client
  return client
};

cct.User.prototype.isAdvisor = function () {
  return this.localId && this.localId.startsWith('advisor_')
}

cct.Room.prototype.getCreator = function () {
  let state = this.state('m.room.create').get()
  if (!state) {
    return null
  }
  let creatorId = state.creator
  let creator = this.members.filter(({id}) => creatorId === id)[0]
  return creator || null
}
