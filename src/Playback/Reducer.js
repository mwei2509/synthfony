let indexDefaults = {
	stop: true,
	startTime: 0,
	currentLoop: 0,
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
		case "CHANGE_STOP_STATUS":
			return { ...state, stop: action.payload };
		case "UPDATE_PLAYBACK_INDEX":
			return { ...state, ...action.payload};
		default:
			return state;
	}
}
export default managePlayback