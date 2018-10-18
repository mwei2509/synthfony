let trackDetailDefaults = {
	bpm: '80',
	beatsPerMeasure: 4,
	pulsePerBeat: 4, // pulse per beats (aka divisions, hardcode for now)
	layer_ids: [],
	interval: '16n',
	loop: true,
	divisions: {} // 0: ['div1', 'div2', 'div3']
};
export const manageDetails = (state = trackDetailDefaults, action) => {
	switch(action.type) {
		case "ADD_NOTE":
			let { div_index, division_id } = action.payload.newNote;
			// check if div index is in the list
			if (!state.divisions[div_index]) {
				return {
					...state,
					divisions: {
						...state.divisions,
						[div_index]: [division_id]
					}
				};
			}
			
			if (!state.divisions[div_index].includes(division_id)) {
				return {...state, 
					divisions: {
						...state.divisions,
						[div_index]: [...state.divisions[div_index], division_id]
					}
				};
			}
			return state;
		case "ADD_TRACK_BPM":
			return {...state, bpm: action.payload};
		case "ADD_LAYER":
			let { newLayer } = action.payload;
			return {...state, layer_ids: [...state.layer_ids, newLayer.id]};
		// case "ADD_MEASURE_TO_TRACK":
		// 	let { addedMeasures } = action.payload;
		// 	if (addedMeasures > state.numMeasures) {
		// 		let addedBeats = addedMeasures * 4; // or whatever the meter is
		// 		let addedDivisions = addedBeats * 4;
		// 		return {
		// 			...state,
		// 			numBeats: addedBeats,
		// 			numMeasures: addedMeasures,
		// 			numDivisions: addedDivisions,
		// 		}
		// 	}
		// 	return state;
		case "CATCH_UP_TRACK":
			let { details } = action.payload;
			return details;
		case "DEACTIVATE_LAYER":
			return {
				...state,
				layer_ids: state.layer_ids.filter(layer_id => layer_id !== action.payload)
			};
			// action.payload
		// case "DELETE_LAYER":
			// let newNumMeasures = action.payload.details.numMeasures;
			// let newLayerIds = action.payload.details.layer_ids;
			// let newDivisions = action.payload.details.divisions;
			// let newNumBeats = state.numBeats;
			// let newNumDivisions = state.numDivisions;
			// if (newNumMeasures < state.numMeasures) {
			// 	newNumBeats = newNumMeasures * 4; // or whatever the meter is
			// 	newNumDivisions = newNumBeats * 4;
			// }
			// return {
			// 	...state,
			// 	numBeats: newNumBeats,
			// 	numMeasures: newNumMeasures,
			// 	numDivisions: newNumDivisions,
			// 	layer_ids: newLayerIds,
			// 	divisions: newDivisions
			// }
		default:
			return state;
	}
}