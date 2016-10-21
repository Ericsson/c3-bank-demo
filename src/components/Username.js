
import React, {Component, PropTypes} from 'react'

class Username extends Component {
  constructor(props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    let name = this.getNameForUser(this.props.user)
    this.state = {name}
  }
  getNameForUser(user) {
    if (user && user.name) {
      return user.name
    } else {
      return user.localId
    }
  }
  handleUpdate() {
    let name = this.getNameForUser(this.props.user)
    if (name !== this.state.name) {
      this.setState({name})
    }
  }
  componentWillUpdate(newProps) {
    if (this.props.user) {
      this.props.user.off('name', this.handleUpdate)
    }
    if (newProps.user) {
      newProps.user.on('name', this.handleUpdate)
    }
    this.handleUpdate()
  }
  componentWillMount() {
    if (this.props.user) {
      this.props.user.on('name', this.handleUpdate)
    }
  }
  componentWillUnmount() {
    if (this.props.user) {
      this.props.user.off('name', this.handleUpdate)
    }
  }
  render() {
    let {name} = this.state
    return (
      <span className='Username'>{name}</span>
    )
  }
}

Username.propTypes = {
  user: PropTypes.object,
}

export default Username
