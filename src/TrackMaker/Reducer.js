import { combineReducers } from 'redux'
import { manageDetails, manageCurrentSelection } from './TrackReducers'
import { manageLayers } from './Layers/Reducer'
import { manageEffects } from './Effects/Reducer'
import { manageMeasures } from './Measures/Reducer'
import { manageBeats } from './Beats/Reducer'
import { manageDivisions } from './Divisions/Reducer'
import { manageNotes } from './Notes/Reducer'

const trackReducer = combineReducers({
	details: manageDetails,
	layers: manageLayers,
	effects: manageEffects,
	measures: manageMeasures,
	beats: manageBeats,
	notes: manageNotes,
	divisions: manageDivisions,
	currentSelection: manageCurrentSelection
})

export default trackReducer
