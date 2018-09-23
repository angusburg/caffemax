import React from 'react'
import {view} from 'react-easy-state'
import {NavLink} from 'react-router-dom'
import store from '~/src/store'

const Landing = () => (
  <div className="component__landing">
    <div className="component__hero">
      <div className="content">
        <h1>Caffemax</h1>
        <p>Perfect caffeine consumption.</p>
        <br />
        <div className="component__landing_cta">
          {store.username ? (
            <NavLink className="btn" to="/me">
              Continue as {store.username}
            </NavLink>
          ) : (
            <NavLink className="btn" to="/register">
              Get Started
            </NavLink>
          )}
        </div>
      </div>
    </div>
  </div>
)

export default view(Landing)
