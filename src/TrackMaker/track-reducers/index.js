import { combineReducers } from 'redux'
import { manageDetails } from './manageDetails'
import { manageLayers } from './manageLayers'
import { manageMeasures } from './manageMeasures'
import { manageBeats } from './manageBeats'
import { manageDivisions } from './manageDivisions'
import { manageNotes } from './manageNotes'
import { manageCurrentSelection } from './manageCurrentSelection'

const trackReducer = combineReducers({
	details: manageDetails,
	layers: manageLayers,
	measures: manageMeasures,
	beats: manageBeats,
	notes: manageNotes,
	divisions: manageDivisions,
	currentSelection: manageCurrentSelection
})

export default trackReducer
