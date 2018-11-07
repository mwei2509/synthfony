export const setStopStatus = (set) => {
	return {
		type: 'CHANGE_STOP_STATUS',
		payload: set
	}
}

export const updateIndices = (indices) => {
	return {
		type: 'UPDATE_PLAYBACK_INDEX',
		payload: indices
	};
}

export const updateTrackPlay = (trackPlay) => {
	return {
		type: 'UPDATE_TRACK_PLAY',
		payload: trackPlay
	}
}