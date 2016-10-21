
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {setMeetingContext, setLocalMediaSource} from 'actions'
import {ADVISOR_ENTER_EVENT} from 'modules/constants'

class GuestBootstrap extends Component {
  static contextTypes = {
    client: PropTypes.object,
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.state = {
      loading: true,
      notFound: false,
    }
  }
  componentWillMount() {
    let room = null
    let {meetingId} = this.props.params
    if (meetingId) {
      room = this.context.client.getRoom(meetingId)
    }
    if (room && room.membership === 'member') {
      this.setState({loading: false})
      if (this.props.ongoingCall) {
        cct.log.info('meeting', 'already have ongoing call')
        return // early return here for hot reloading
      }
      let call = room.startPassiveCall()
      room.send(ADVISOR_ENTER_EVENT, {time: Date.now()})
      this.props.dispatch(setMeetingContext({room, call, role: 'advisor'}))
      let localSource = new cct.DeviceSource()
      this.props.dispatch(setLocalMediaSource(localSource))
    } else {
      this.setState({loading: false, notFound: true})
      this.context.router.replace('/advisor/authed/meeting/not-found')
    }
  }
  render() {
    if (this.state.loading) {
      return null
    } else if (this.state.notFound) {
      return <h1>Meeting not found :(</h1>
    } else {
      return this.props.children
    }
  }
}

GuestBootstrap.propTypes = {
  children: PropTypes.element.isRequired,
}

export default connect((state) => ({
  ongoingCall: state.meeting.context.call,
}))(GuestBootstrap)
