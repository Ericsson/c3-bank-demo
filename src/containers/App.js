
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import ReactHelmet from 'react-helmet'
import {NotificationContainer} from 'react-notifications'

const Helmet = connect((state) => ({
  title: state.title,
}))(ReactHelmet)

class App extends Component {
  render() {
    let {children} = this.props
    return (
      <div className='App'>
        <Helmet />
        <NotificationContainer />
        {children}
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
}

export default App
