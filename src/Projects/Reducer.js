import { combineReducers } from 'redux'
import { manageListing } from './Listing/Reducer'
import { manageCurrentProject } from './CurrentProject/Reducer'

const projectReducer = combineReducers({
	listing: manageListing,// list of projects in current view
	currentProject: manageCurrentProject, // current project details
})

export default projectReducer
