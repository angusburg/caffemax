import React from 'react'
import {view} from 'react-easy-state'
import {withRouter} from 'react-router-dom'
import store from '~/src/store'
import user from '~/src/storage/user'

class Register extends React.Component {
  constructor() {
    super()

    this.state = {
      loginUsername: '',
      registerUsername: '',
      registerPassword: '',
    }

    this.submitLogin = this.submitLogin.bind(this)
  }

  async submitLogin() {
    const {loginUsername} = this.state
    const {history} = this.props
    const response = await fetch(
      `http://localhost:5000/api/user?username=${loginUsername}`
    )

    if (response.status === 200) {
      user.set('username', loginUsername)

      const json = await response.json()
      store.username = loginUsername
      store.firstName = json.user[2]
      store.lastName = json.user[3]
      store.sleepTime = json.user[5]
      store.timeBetween = json.user[6]
      history.push('/me')
    }
  }

  render() {
    const {registerUsername, registerPassword, loginUsername} = this.state

    return (
      <div className="component__page">
        <div className="container">
          <div className="row">
            <div className="six columns">
              <h1>Register</h1>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={event =>
                    this.setState({registerUsername: event.target.value})
                  }
                />
                <label>Password</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={event =>
                    this.setState({registerPassword: event.target.value})
                  }
                />
              </div>
            </div>
            <div className="six columns">
              <h1>Log In</h1>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={event =>
                    this.setState({loginUsername: event.target.value})
                  }
                />
                <label>Password</label>
                <input type="password" />
                <br />
                <button className="btn" onClick={this.submitLogin}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default view(withRouter(Register))
