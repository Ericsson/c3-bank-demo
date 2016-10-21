
import React, {Component, PropTypes} from 'react'

const TIMEOUT = 1000

export default class IfNeedScreenSharingExtension extends Component {
  static propTypes = {
    children: PropTypes.element,
    extensionId: PropTypes.string.isRequired,
  }
  constructor(...args) {
    super(...args)
    this.handleWindowMessage = this.handleWindowMessage.bind(this)
    this.state = {
      installed: false,
      timedOut: false,
    }
  }
  componentDidMount() {
    window.addEventListener('message', this.handleWindowMessage)
    window.postMessage({
      extensionId: this.props.extensionId,
      message: 'getInstalledStatus'
    }, '*');
    this.timeout = setTimeout(() => {
      this.setState({timedOut: true})
    }, TIMEOUT)
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.handleWindowMessage)
    clearTimeout(this.timeout)
  }
  handleWindowMessage(event) {
    let data = event.data
    if (!data.extensionId || !data.message) {
      return
    }
    let extensionIdMatch = data.extensionId === this.props.extensionId
    let messageMatch = data.message === 'extensionIsInstalled'
    if (extensionIdMatch && messageMatch) {
      this.setState({installed: true})
    }
  }
  render() {
    let {installed, timedOut} = this.state
    if (timedOut && !installed) {
      return this.props.children
    }
    return null
  }
}
