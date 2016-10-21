
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
class CustomerLandingPage extends Component {
  render() {
    return (
      <div className="CustomerLandingPage">
        <div className="customDialog">
          <h1>Waiting for an Advisor</h1>
          <p> We have notified the Advisors that you are ready to start the meeting.
            Please hold.</p>
        </div>
      </div>
    )
  }
}

export default connect()(CustomerLandingPage)
