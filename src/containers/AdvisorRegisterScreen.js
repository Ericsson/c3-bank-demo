
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Dialog, Logo} from 'components'
import {isAuthenticated, register} from 'modules/advisorAuth'

class RegisterForm extends Component {
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
    let fullname = this.fullname.value
    let username = this.username.value
    let password = this.password.value

    if (this.state.submitting) {
      return
    }
    this.setState({submitting: true})

    return register(this.context.client, fullname, username, password)
      .then(() => {
        this.setState({submitting: false})
        alert('New user registered')
        this.context.router.replace('advisor/login')
      })
      .catch((error) => {
        if (error.stack) {
          cct.log.error('meeting', 'Login failed: ' + (error.stack || error))
        }
        this.setState({
          error: 'Register failed: ' + error,
          submitting: false,
        })
      })
  }
  render() {
      let {submitting, error} = this.state
      return (
        <form onSubmit={this.handleSubmit} className="LoginForm">
          <h1>Advisor Registration</h1>
          <div className="LoginForm-fields">
              <label>Full name</label>
              <input className="LoginForm-input" type="text" ref={ref => {this.fullname = ref; ref && ref.focus()}} required />
              <label>Username</label>
              <input className="LoginForm-input" type="text" ref={ref => {this.username = ref; ref && ref.focus()}} required />
              <label>Password</label>
              <input className="LoginForm-input" type="password" ref={ref => this.password = ref} required />
            {submitting && '...'}
            {error}
          </div>
          <div className="LoginForm-buttons">
            <input type="submit" className="default-button invert" value="Register"></input>
            <Link to="/advisor" className="default-button">Cancel</Link>
          </div>
        </form>
      )
    }
}

RegisterForm = connect()(RegisterForm)

class AdvisorRegisterScreen extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
    client: React.PropTypes.object,
  }
  render() {
    return (
      <div className="AdvisorRegisterScreen">
        <Logo className="LoginScreen-Logo"/>
        <Dialog size="middle">
          <RegisterForm/>
        </Dialog>
      </div>
    )
  }
}

AdvisorRegisterScreen.propTypes = {
  children: PropTypes.element,
}

export default connect()(AdvisorRegisterScreen)
