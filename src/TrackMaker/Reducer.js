import { combineReducers } from 'redux'
import { manageDetails, manageCurrentSelection } from './TrackReducers'
import { manageLayers } from './Layers/Reducer'
import { manageEffects } from './Effects/Reducer'
import { managePlayback } from './Playback/Reducer'

const trackReducer = combineReducers({
	details: manageDetails,
	layers: manageLayers,
	effects: manageEffects,
	currentSelection: manageCurrentSelection,
	playback: managePlayback
})

export default trackReducer
