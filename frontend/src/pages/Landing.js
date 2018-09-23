import React from 'react'
import {view} from 'react-easy-state'
import {Box, Hero, Header, Paragraph, Screen} from 'remiges'
import {NavLink} from 'react-router-dom'
import Background from '~/assets/bg.jpg'
import store from '~/src/store'

const Landing = () => (
  <Screen>
    <Hero
      background={`url(${Background}) no-repeat center`}
      backgroundSize="cover"
      height="90vh"
    >
      <div>
        <Header>Caffemax</Header>
        <Paragraph>Perfect caffeine consumption</Paragraph>
        <br />
        <div className="landing_cta">
          <NavLink className="button" to="/me">
            {store.username ? `Continue as ${store.firstName}` : 'Get Started'}
          </NavLink>
        </div>
      </div>
    </Hero>
    <Box height="10vh">
      <Box verticallyCenter />
    </Box>
  </Screen>
)

export default view(Landing)
