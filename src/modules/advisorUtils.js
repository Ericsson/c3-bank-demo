
import {MEETING_TYPE} from 'modules/constants'

export function bookNewMeeting(client, {name}) {
  console.log('Booking a meeting: ' + name)
  let powerLevels = cct.PowerLevelsEdit.fromDefault(client.user)
      .addState(0)
      .invite(100)
      .kick(50)
      .redact(100)
      .userDefault(0)
      .eventDefault(0)
      .setName(100)
      .setTopic(0)
      .setPowerLevels(100)

  return client.createRoom({
    name,
    type: MEETING_TYPE,
    joinRule: 'open',
    guestAccessRule: 'open',
    powerLevels,
  }).then((room) => {
    return room.editPowerLevels()
      .user(client.user, 50)
      .commit()
  })
}

export function createMeetingsQuery(client) {
  return client.createRoomQuery((room) => {
    if (room.type === MEETING_TYPE && room.name) {
      return room
    }
  })
}

export function createMeetingLink({id}) {
  return `${location.origin}#/meeting/${id}`
}
