
import React, {Component, PropTypes} from 'react'

const DEFAULT_AVATAR_SIZE = 128

class Avatar extends Component {
  constructor(props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    let url = this.getAvatarUrlForUser(this.props.user)
  }
  getAvatarUrlForUser(user) {
    let url = this.props.defaultAvatarUrl
    let {size = DEFAULT_AVATAR_SIZE} = this.props
    if (user && user.avatar) {
      url = user.avatar.thumbnail(size)
    }
    return url
  }
  handleUpdate() {
    this.forceUpdate()
  }
  componentWillReceiveProps(newProps) {
    if (this.props.user) {
      this.props.user.off('avatar', this.handleUpdate)
    }
    if (newProps.user) {
      newProps.user.on('avatar', this.handleUpdate)
    }
    this.handleUpdate()
  }
  componentWillMount() {
    if (this.props.user) {
      this.props.user.on('avatar', this.handleUpdate)
    }
  }
  componentWillUnmount() {
    if (this.props.user) {
      this.props.user.off('avatar', this.handleUpdate)
    }
  }
  render() {
    let {size = DEFAULT_AVATAR_SIZE, clickHandler, style={}} = this.props
    let avatarUrl = this.getAvatarUrlForUser(this.props.user)
    return (
      <div className='Avatar' style={{
        backgroundImage: `url(${avatarUrl})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        width: size,
        height: size,
        ...style
      }}
      onClick={clickHandler}
      >
      {this.props.children}
    </div>
    )
  }
}

Avatar.propTypes = {
  user: PropTypes.object,
  size: PropTypes.number,
  defaultAvatarUrl: PropTypes.string,
}

export default Avatar
