import { combineReducers } from 'redux'
import { manageListing, manageHomepage, manageDashboard } from './Listing/Reducer'
import { manageCurrentProject } from './CurrentProject/Reducer'

const listingReducer = combineReducers({
	homepage: manageListing.bind(this, 'homepage'),
	dashboard: manageListing.bind(this, 'dashboard')
})

const projectReducer = combineReducers({
	listing: listingReducer,
	currentProject: manageCurrentProject, // current project details
})

export default projectReducer
