import { combineReducers } from 'redux'
import trackReducer from './TrackMaker/track-reducers/index.js'
// import editorReducer from './TrackMaker/editor-reducers/index.js'
import managePlayback from './Playback/managePlayback.js'
import manageSocket from './Socket/manageSocket'

const rootReducer = combineReducers({
	track: trackReducer,
	playback: managePlayback,
	// editor: editorReducer,
	connection: manageSocket
})

export default rootReducer
