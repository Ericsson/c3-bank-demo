
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class MeetingNotFound extends Component {
  render() {
    let {children} = this.props
    return (
      <div className='MeetingNotFound'>
        THIS IS IN MeetingNotFound
      </div>
    )
  }
}

export default connect()(MeetingNotFound)
