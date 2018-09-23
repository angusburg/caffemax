import {store} from 'react-easy-state'
import user from './storage/user'

export default store({
  username: user.username || '',
  userId: 0,
  firstName: '',
  lastName: '',
  sleepTime: 0,
  timeBetween: 0,
})
