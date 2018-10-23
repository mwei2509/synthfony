import { combineReducers } from 'redux'
import trackReducer from './TrackMaker/Reducer'
import managePlayback from './Playback/Reducer'
import manageSocket from './Collaboration/Reducer'
import manageNotifications from './Notifications/Reducer'

const rootReducer = combineReducers({
	track: trackReducer,
	playback: managePlayback,
	connection: manageSocket,
	notifications: manageNotifications
})

export default rootReducer
