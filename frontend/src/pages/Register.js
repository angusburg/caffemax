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
      firstName: '',
      sleepTime: 0,
      timeBetween: 0,
    }

    this.submitLogin = this.submitLogin.bind(this)
    this.submitRegister = this.submitRegister.bind(this)
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
  async submitRegister() {
    const {
      registerPassword,
      registerUsername,
      sleepTime,
      firstName,
      timeBetween,
    } = this.state
    const {history} = this.props
    fetch(`http://localhost:5000/api/user`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        username: registerUsername,
        password: registerPassword,
        time_between: sleepTime,
        sleep_time: timeBetween,
        firstName,
        lastName: ' name',
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        user.set('username', registerUsername)
        store.username = registerUsername
        history.push('/me')
      })
  }

  render() {
    const {
      registerUsername,
      registerPassword,
      loginUsername,
      firstName,
      timeBetween,
      sleepTime,
    } = this.state

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
                <label>Preferred Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={event =>
                    this.setState({firstName: event.target.value})
                  }
                />
                <label>Sleep Time (hrs): </label>
                <input
                  type="number"
                  value={sleepTime}
                  onChange={event =>
                    this.setState({sleepTime: event.target.value})
                  }
                />
                <label>Time Between Drinks (hrs): </label>
                <input
                  type="number"
                  value={timeBetween}
                  onChange={event =>
                    this.setState({timeBetween: event.target.value})
                  }
                />
                <br />

                <button className="btn" onClick={this.submitRegister}>
                  Register
                </button>
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
