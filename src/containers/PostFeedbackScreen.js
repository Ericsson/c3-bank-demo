import React, {Component} from 'react';
import {Dialog, Logo} from 'components'

export default class PostFeedbackScreen extends Component {
  render() {
    return (
      <main className="customer-feedback customer-feedback-form">
        <div className="logo-container">
          <Logo className="FeedbackScreen-Logo"/>
        </div>
        <Dialog>
          <h1>Thank you for your feedback!</h1>
          <h3>You can now safely close this window.</h3>
        </Dialog>
      </main>
    )
  }
}
