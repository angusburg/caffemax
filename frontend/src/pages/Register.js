import React from 'react'
import {view} from 'react-easy-state'
import {Box, Column, Columns, Hero, Header, Paragraph, Screen} from 'remiges'
import store from '~/src/store'

class Register extends React.Component {
  constructor() {
    super()

    this.state = {
      loginUsername: '',
      registerUsername: '',
      registerPassword: '',
    }

    store.username = ''

    this.submitLogin = this.submitLogin.bind(this)
  }

  async submitLogin() {
    const {loginUsername} = this.state
    const response = await fetch(
      `http://localhost:5000/api/user&username=${loginUsername}`,
      {
        method: 'post',
      }
    )
    console.log(response)
  }

  render() {
    const {registerUsername, registerPassword, loginUsername} = this.state

    return (
      <Screen>
        <Header>Register</Header>
        <label>Username</label>
        <input
          type="text"
          value={registerUsername}
          onChange={event =>
            this.setState({registerUsername: event.target.value})
          }
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          value={registerPassword}
          onChange={event =>
            this.setState({registerPassword: event.target.value})
          }
        />

        <Header>Log In</Header>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={loginUsername}
            onChange={event =>
              this.setState({loginUsername: event.target.value})
            }
          />
          <br />
          <label>Password</label>
          <input type="password" />
          <br />
          <button onClick={this.submitLogin}>Login</button>
        </div>
      </Screen>
    )
  }
}

export default view(Register)
