

const updateBeats = (beats, beatId, updatedVal) => {
	let beat = beats[beatId];
	return {
		...beats, 
		[beatId]: {
			...beat,
			...updatedVal
		}
	};
}

export const manageBeats = (state = {}, action) => {
	switch(action.type) {
		case "ADD_MEASURE":
			let { newBeats } = action.payload;
			if (newBeats) {
				return {...state, ...newBeats};
			}
			return state;
		case "EDIT_BEAT":
			let { newDivisions, beatId } = action.payload;
			let newBeat = {
				divisions: newDivisions,
				// sequence: makeBeatSequence(beatId, newDivisions)
			};
			let beatCopy = updateBeats(state, beatId, newBeat);
			// updateLayerSequence(action.payload.layerId, [beatId], beatCopy);
			return beatCopy;
		case "CATCH_UP_TRACK":
			let { beats } = action.payload;
			return beats;
		default:
			return state;
	}
}