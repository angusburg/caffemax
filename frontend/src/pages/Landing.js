import React from 'react'
import Page from '../components/Page'

import User from '../storage/User'

export default class Landing extends React.Component {
  constructor() {
    super()
    this.state = {
      name: User.name,
    }

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
  }

  handleUsernameChange(event) {
    const name = event.target.value
    this.setState({name}, () => {
      User.set('name', name)
    })
  }

  render() {
    const {name} = this.state

    return (
      <Page>
        <h1>Caffemax</h1>
        <span>Perfect caffeine consumption.</span>
        <h1>Welcome back {name}</h1>
        <input type="text" onChange={this.handleUsernameChange} value={name} />
      </Page>
    )
  }
}
