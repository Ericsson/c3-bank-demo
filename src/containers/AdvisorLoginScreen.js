
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Dialog, Logo} from 'components'
import {setAuthInfo} from 'actions'
import {loginWithPassword, isAuthenticated} from 'modules/advisorAuth'

class LoginForm extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
    client: React.PropTypes.object,
  }
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      submitting: false,
      error: null,
    }
  }
  handleSubmit(event) {
    event.preventDefault()
    let username = this.username.value
    let password = this.password.value

    if (this.state.submitting) {
      return
    }
    this.setState({submitting: true})
    return loginWithPassword(this.context.client, username, password)
      .then(() => {
        this.setState({submitting: false})
        this.context.router.replace('/advisor/authed')
      })
      .catch((error) => {
        if (error.stack) {
          cct.log.error('meeting', 'Login failed: ' + (error.stack || error))
        }
        this.setState({
          error: 'Login failed: ' + error,
          submitting: false,
        })
      })
  }
  render() {
      let {submitting, error} = this.state
      return (
        <form onSubmit={this.handleSubmit} className="LoginForm">
          <h1>Webmeeting Advisor Login</h1>
          <div className="LoginForm-fields">
              <label>Username</label>
              <input className="LoginForm-input" type="text" ref={ref => {this.username = ref; ref && ref.focus()}} required />
              <label>Password</label>
              <input className="LoginForm-input" type="password" ref={ref => this.password = ref} required />
            {submitting && '...'}
            {error}
          </div>
          <div className="LoginForm-buttons">
            <Link to="/register" className="default-button"> Register </Link>
            <input type="submit" className="default-button invert" value="Log in"></input>
          </div>
        </form>
      )
    }
}

LoginForm = connect()(LoginForm)

let AdvisorLoginScreen = () => (
  <div className='AdvisorLoginScreen'>
    <Logo className="LoginScreen-Logo"/>
    <Dialog size="middle">
      <LoginForm/>
    </Dialog>
  </div>
)

export default connect()(AdvisorLoginScreen)
