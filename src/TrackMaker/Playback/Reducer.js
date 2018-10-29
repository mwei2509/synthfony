let indexDefaults = {
	stop: true,
	startTime: 0,
	currentLoop: 0,
	measureIndex: 0,
	beatIndex: 0,
	divisionIndex: 0,
	trackPlay: {
		progress: 0,
		waveform: {},
		meter: {},
		maxMeter: 0
	},
	currentTrackIndex: 0, // beat index
	currentTrackDivision: 0, // div index for track
	layerIndices: {}, /* 
		[layer_id]: {
			current_measure: [measure_id]
		}
	*/
	measureIndices: {}, 
	/* 
		[measure_id]: {
			current_beat: [beat_id]
		}
	*/
	divIndex: 0 // 0-4
};

export const managePlayback = (state = indexDefaults, action) => {
	switch(action.type) {
		case "CATCH_UP_TRACK":
			return {
				...state,
				trackPlay: {
					...state.trackPlay,
					...action.payload.trackPlay
				}
			}
		case "UPDATE_TRACK_PLAY":
			return {
				...state,
				trackPlay: {
					...state.trackPlay,
					...action.payload
				}
			}
		case "CHANGE_STOP_STATUS":
			return { ...state, stop: action.payload };
		case "UPDATE_PLAYBACK_INDEX":
			return { ...state, ...action.payload};
		default:
			return state;
	}
}
export default managePlayback