import React from 'react'
import {view} from 'react-easy-state'
import store from '~/src/store'

const Dashboard = () => (
  <div className="component__page">
    <div className="container">
      <h1>Welcome back, {store.firstName}</h1>
    </div>
  </div>
)

export default view(Dashboard)
