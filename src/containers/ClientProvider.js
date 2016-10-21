
import React, {Component, PropTypes} from 'react'

class ClientProvider extends Component {
  static childContextTypes = {
    client: PropTypes.object,
  }
  getChildContext() {
    return {client: this.props.client}
  }
  render() {
    return this.props.children
  }
}

ClientProvider.propTypes = {
  client: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
}

export default ClientProvider

