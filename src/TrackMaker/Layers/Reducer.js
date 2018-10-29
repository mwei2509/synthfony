let defaultLayers = {};

export const manageLayers = (state = defaultLayers, action) => {
	switch(action.type) {
		case 'ADD_NOTE':
			let { newNote } = action.payload
			return {
				...state,
				[newNote.layer_id]: {
					...state[newNote.layer_id],
					noteParts: [
						...state[newNote.layer_id].noteParts, 
						newNote
					]
				}
			};
		case 'ADD_LAYER':
			let { newLayer } = action.payload;
			return {
				...state,
				[newLayer.id]: newLayer
			};
		case 'ADD_MEASURE':
			// let { newMeasure, indexAt } = action.payload;
			// let newLayerMeasures = [...state[newMeasure.layer_id].measure_ids];
			// if (typeof indexAt === 'number') {
			// 	newLayerMeasures.splice(indexAt, 0, newMeasure.id);
			// } else {
			// 	newLayerMeasures = [...newLayerMeasures, newMeasure.id];
			// }
			// return {
			// 	...state,
			// 	[newMeasure.layer_id]: {
			// 		...state[newMeasure.layer_id],
			// 		measure_ids: newLayerMeasures
			// 	}
			// };
			return {
				...state,
				[action.payload.addMeasureToLayer]: {
					...state[action.payload.addMeasureToLayer],
					numMeasures: action.payload.newNumMeasures
				}
			}
		case 'EDIT_LAYER':
			return {
				...state,
				[action.payload.layerId]: {
					...state[action.payload.layerId],
					...action.payload.change
				}
			}
		case "CATCH_UP_TRACK":
			let { layers } = action.payload;
			return layers;
		// case "DELETE_LAYER":
		// 	let { newLayers } = action.payload;
		// 	return newLayers;
		case "DEACTIVATE_LAYER":
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					active: false
				}
			}
		case 'ADD_EFFECT_TO_LAYER':
			return {
				...state,
				[action.payload.layerId]: {
					...state[action.payload.layerId],
					effect_ids: [
						...state[action.payload.layerId].effect_ids,
						action.payload.effectId
					]
				}
			}
		case 'MUTE_LAYER':
			let layerToMute = 'mute';
			if (state[action.payload].status === 'mute') {
				layerToMute = 'normal';
			}
			let newMuteState = {};
			Object.keys(state).forEach((layer_id) => {
				let status = layer_id === action.payload ? layerToMute : state[layer_id].status;
				newMuteState[layer_id] = {
					...state[layer_id],
					status: status
				}
			});
			return newMuteState;
		case 'SOLO_LAYER':
		// toggle
			let otherLayers = 'mute';
			let chosenLayer = 'solo';
			// if layer we are toggling is already solo, make everything normal
			if (state[action.payload].status === 'solo') {
				otherLayers = chosenLayer = 'normal';
			}
			let newState = {};
			Object.keys(state).forEach((layer_id) => {
				let status = layer_id === action.payload ? chosenLayer : otherLayers;
				newState[layer_id] = {
					...state[layer_id],
					status: status
				}
			});
			return newState;
		default:
			return state;
	}
}