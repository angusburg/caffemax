import '@babel/polyfill'
import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Register from './pages/Register'

render(
  <Router>
    <div>
      <Route exact path="/" component={Landing} />
      <Route exact path="/me" component={Dashboard} />
      <Route exact path="/register" component={Register} />
    </div>
  </Router>,
  document.getElementById('app')
)
