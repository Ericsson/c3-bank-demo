
import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

class NotFoundScreen extends Component {
  render() {
    let {children} = this.props
    return (
      <div className='NotFoundScreen'>
        <div>
          This page has not content, you should go to...
        </div>
        <Link to='/advisor'>...the advisor login</Link>
      </div>
    )
  }
}

export default connect()(NotFoundScreen)
