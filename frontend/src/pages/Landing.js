import React from 'react'
import {Box, Hero, Header, Paragraph, Screen} from 'remiges'
import User from '../storage/User'
import Background from '~/assets/bg.jpg'

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
      <Screen>
        <Hero
          background={`url(${Background}) no-repeat center`}
          backgroundSize="cover"
          height="90vh"
        >
          <div>
            <Header>Caffemax</Header>
            <Paragraph>Perfect caffeine consumption</Paragraph>
            <div className="landing_cta">
              <button className="button">Get Started</button>
            </div>
          </div>
        </Hero>
        <Box height="10vh">
          <Box verticallyCenter />
        </Box>
      </Screen>
    )
  }
}
