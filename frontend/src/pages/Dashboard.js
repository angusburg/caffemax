import React from 'react'
import {view} from 'react-easy-state'
import store from '~/src/store'
import Java from '~/assets/java.png'

class Dashboard extends React.Component {
  constructor() {
    super()

    this.state = {
      drinks: [],
      timeToDrink: false,
      newDrinkDescription: '',
      newDrinkSize: 12,
    }
  }

  async componentDidMount() {
    const responseShouldDrink = await fetch(
      `http://localhost:5000/api/should_drink?username=${store.username}`
    )
    const jsonShouldDrink = await responseShouldDrink.json()

    if (jsonShouldDrink.should_drink) {
      this.setState({
        timeToDrink: !!jsonShouldDrink.should_drink,
      })
    }

    const responseDrinks = await fetch(
      `http://localhost:5000/api/drinks?username=${store.username}`
    )
    const jsonDrinks = await responseDrinks.json()

    if (jsonDrinks.drinks) {
      this.setState({
        drinks: jsonDrinks.drinks,
      })
    }
  }

  render() {
    const {drinks, timeToDrink, newDrinkDescription, newDrinkSize} = this.state
    return (
      <div className="component__page">
        <img className="java" src={Java} />
        <div className="container">
          <h1>Welcome back, {store.firstName}</h1>
          <hr />
          <h4>Is It Time To Drink? {timeToDrink ? 'Yes' : 'No'}</h4>
          <input
            type="text"
            value={newDrinkDescription}
            onChange={event => {
              this.setState({
                newDrinkDescription: event.target.value,
              })
            }}
            placeholder="Name"
          />
          <input
            type="number"
            value={newDrinkSize}
            onChange={event => {
              this.setState({
                newDrinkSize: event.target.value,
              })
            }}
            placeholder="fl oz"
          />
          <br />
          <button
            className="btn"
            onClick={() => {
              fetch(`http://localhost:5000/api/drinks`, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                  name: newDrinkDescription || '',
                  caffeine: 100,
                  fluidOunces: newDrinkSize,
                }),
              })
                .then(res => res.json())
                .then(json => {
                  console.log(json)
                  this.forceUpdate()
                })
            }}
          >
            Log New Drink
          </button>

          <br />
          <br />
          <br />
          <h4>Drink History</h4>
          <ol>
            {drinks.map((drink, i) => (
              <li key={i}>
                {drink[1]} ({drink[3]} fl oz)
              </li>
            ))}
          </ol>

          <br />
          <br />
          <h4>About Me</h4>
          <p>
            Sleep Time (hrs):{' '}
            <input
              type="text"
              value={store.sleepTime}
              onChange={event => {
                store.sleepTime = event.target.value
              }}
            />
            <br />
            Time Between Drinks (hrs):{' '}
            <input
              type="text"
              value={store.timeBetween}
              onChange={event => {
                store.timeBetween = event.target.value
              }}
            />
          </p>
          <button
            className="btn"
            onClick={() => {
              fetch(`http://localhost:5000/api/settings`, {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                  user_id: store.userId,
                  time_between: store.sleepTime,
                  sleep_time: store.timeBetween,
                }),
              })
                .then(res => res.json())
                .then(json => console.log(json))
            }}
          >
            Update
          </button>
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    )
  }
}

export default view(Dashboard)
