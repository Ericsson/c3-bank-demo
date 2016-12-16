
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {startScreenSharing, stopScreenSharing} from 'actions'
import {Video, Dialog} from 'components'

class MeetingViewPresent extends Component {
  constructor(props) {
    super(props)
    this._onRemoteStream = () => {
      this.forceUpdate()
    }
  }
  componentDidMount() {
    this.props.remoteScreenSource.on('stream', this._onRemoteStream)
  }
  componentWillUnmount() {
    this.props.remoteScreenSource.off('stream', this._onRemoteStream)
  }
  renderAdvisor() {
    let {localScreenSource, startScreenSharing, stopScreenSharing} = this.props
    let content = null
    if (localScreenSource) {
      return (
        <div className='MeetingViewPresent'>
          <Video source={localScreenSource} />
          <div className='MeetingViewPresent-button-container'>
            <div className='MeetingViewPresent-button' onClick={stopScreenSharing}>
              Stop sharing
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className='MeetingViewPresent'>
          <div className='MeetingViewPresent-button-container'>
            <div className='MeetingViewPresent-button' onClick={startScreenSharing}>
              Start sharing
            </div>
          </div>
        </div>
      )
    }
  }
  renderCustomer() {
    let {remoteScreenSource} = this.props
    if(remoteScreenSource.stream) {
      return (
        <div className='MeetingViewPresent'>
          <Video source={remoteScreenSource} />
        </div>
      )
    } else {
      return (
        <div className='MeetingViewPresent'>
          <Dialog>
            <div className='MeetingViewPresent-dialog'>
              <h1>Waiting for advisor to share screen</h1>
            </div>
          </Dialog>
        </div>
      )
    }
  }
  render() {
    let {role} = this.props
    if (role === 'advisor') {
      return this.renderAdvisor()
    } else if (role === 'customer') {
      return this.renderCustomer()
    }
  }
}

function mapStateToProps({meeting}) {
  return {
    role: meeting.context.role,
    remoteScreenSource: meeting.media.remoteScreenSource,
    localScreenSource: meeting.media.localScreenSource,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    startScreenSharing: () => dispatch(startScreenSharing()),
    stopScreenSharing: () => dispatch(stopScreenSharing()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingViewPresent)
