import React from 'react'
import {view} from 'react-easy-state'
import {Box, Hero, Header, Paragraph, Screen} from 'remiges'
import store from '~/src/store'

const Dashboard = () => (
  <Screen>
    <Header>Welcome back, {store.firstName}</Header>
  </Screen>
)

export default view(Dashboard)
