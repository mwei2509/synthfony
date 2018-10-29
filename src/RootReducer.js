import { combineReducers } from 'redux'
import trackReducer from './TrackMaker/Reducer'
import manageSocket from './Collaboration/Reducer'
import manageNotifications from './Notifications/Reducer'
import manageAccount from './Account/Reducer'
import manageProjects from './Projects/Reducer'

const rootReducer = combineReducers({
	track: trackReducer,
	connection: manageSocket,
	notifications: manageNotifications,
	account: manageAccount,
	projects: manageProjects
})

export default rootReducer
