

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

// const makeBeatSequence = (beat_id, divisions) => {
// 	let beat = [];
// 	let d = divisions.map((division) => {
// 		if (division.note && division.note.length > 0) {
// 			return division;
// 		} else {
// 			return null;
// 		}
// 	});
// 	return d;
// }

// const updateLayerSequence = (layerId, newBeats, beatsMap) => {
// 	let wLayer = window.Track[layerId];
// 	newBeats.forEach((beat_id) => {
// 		let beatSequence = beatsMap[beat_id].sequence;
// 		if (!wLayer.beat_ids.includes(beat_id)) {
// 			wLayer.beat_ids.push(beat_id);
// 		}
// 		wLayer.sequence.add(wLayer.beat_ids.indexOf(beat_id), beatSequence);
// 	});
// }

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