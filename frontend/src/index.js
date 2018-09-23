import '@babel/polyfill'
import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Register from './pages/Register'
import store from './store'
import user from './storage/user'

class App extends React.Component {
  constructor() {
    super()
    if (user.username) {
      const response = fetch(
        `http://localhost:5000/api/user?username=${user.username}`
      )
        .then(res => res.status && res.json())
        .then(json => {
          store.userId = json.user[0]
          store.firstName = json.user[2]
          store.lastName = json.user[3]
          store.sleepTime = json.user[5]
          store.timeBetween = json.user[6]
        })
    }
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Landing} />
          <Route exact path="/me" component={Dashboard} />
          <Route exact path="/register" component={Register} />
        </div>
      </Router>
    )
  }
}

// const Application = view(<App />)
render(<App />, document.getElementById('app'))
