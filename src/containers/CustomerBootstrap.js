
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bootstrapCustomer, isAuthenticated} from 'modules/customerAuth'
import {setMeetingContext, setLocalMediaSource} from 'actions'

class ErrorPage extends Component {
  render() {
    return (
      <div>:( UNEXPECTED ERROR {this.props.error}</div>
    )
  }
}

class CustomerBootstrap extends Component {
  static contextTypes = {
    client: PropTypes.object,
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.state = {
      loading: true,
      error: null,
    }
  }
  componentWillMount() {
    if (isAuthenticated(client)) {
      cct.log.info('meeting', 'client is already authenticated')
      this.setState({loading: false})
      return
    }
    bootstrapCustomer(client, this.props.params.meetingId)
      .catch((error) => {
        cct.log.info('meeting', 'failed to bootstrap customer: ' + (error.stack || error))
        this.setState({loading: false, error: error.toString()})
      })
      .then(({room, call}) => {
        cct.log.info('meeting', 'bootstrap complete, joined meeting: ' + room.name)
        this.props.dispatch(setMeetingContext({room, call, role: 'customer'}))
        this.setState({loading: false})
        let localSource = new cct.DeviceSource()
        this.props.dispatch(setLocalMediaSource(localSource))
      })
  }
  render() {
    if (this.state.loading) {
      return null
    } else if (this.state.error) {
      return <ErrorPage/>
    } else {
      return this.props.children
    }
  }
}

CustomerBootstrap.propTypes = {
  children: PropTypes.element.isRequired,
}

export default connect()(CustomerBootstrap)
