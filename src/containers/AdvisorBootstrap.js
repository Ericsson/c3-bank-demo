
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {trySavedSession, isAuthenticated} from 'modules/advisorAuth'
import {NotificationManager} from 'react-notifications'

class AdvisorBootstrap extends Component {
  static contextTypes = {
    client: PropTypes.object,
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.state = {
      loading: true,
    }
  }
  componentWillMount() {
    if (isAuthenticated(client)) {
      cct.log.info('meeting', 'client is already authenticated')
      this.setState({loading: false})
      return
    }
    trySavedSession(client).then(() => {
      cct.log.info('meeting', 'using saved session')
      this.setState({loading: false})
      if (!this.props.location.pathname.startsWith('/advisor/authed')) {
        this.context.router.replace('/advisor/authed')
      }
    }, (error) => {
      cct.log.info('meeting', 'not using saved session: ' + error)
      this.setState({loading: false})
      if (!this.props.location.pathname.startsWith('/advisor/login')) {
        this.context.router.replace('/advisor/login')
      }
    }).catch((error) => {
      cct.log.error('meeting', 'error initializing session: ' + error)
      NotificationManager.error('Error initializing session: ' + error)
    })
  }
  render() {
    if (this.state.loading) {
      return null
    } else {
      return this.props.children
    }
  }
}

AdvisorBootstrap.propTypes = {
  children: PropTypes.element,
}

export default connect()(AdvisorBootstrap)
