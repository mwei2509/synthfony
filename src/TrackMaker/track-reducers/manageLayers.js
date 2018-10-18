let defaultLayers = {
	/* 
		[layer_id]: { 
			measure_ids: [], 
			player: '//instructions', 
			ready: false,
		}
	*/
};

// const getLayerCopy = (layerId, state) => {
// 	let layer = state[layerId];
// 	return {
// 		...layer, 
// 		measure_ids: layer.measure_ids, 
// 	};
// }

export const manageLayers = (state = defaultLayers, action) => {
	switch(action.type) {
		case 'ADD_LAYER':
			let { newLayer } = action.payload;
			return {
				...state,
				[newLayer.id]: newLayer
			};
		case 'ADD_MEASURE':
			let { newMeasure, indexAt } = action.payload;
			let newLayerMeasures = [...state[newMeasure.layer_id].measure_ids];
			if (typeof indexAt === 'number') {
				newLayerMeasures.splice(indexAt, 0, newMeasure.id);
			} else {
				newLayerMeasures = [...newLayerMeasures, newMeasure.id];
			}
			return {
				...state,
				[newMeasure.layer_id]: {
					...state[newMeasure.layer_id],
					measure_ids: newLayerMeasures
				}
			};
		case 'INSERT_MEASURE':
		// case 'EDIT_LAYER_TYPE':
		// 	let { type, player, ready, trigger, noteOptions, isSampler } = action.payload;
		// 	let layerUpdate = {
		// 		...state[action.payload.layer.id],
		// 		type: type,
		// 		player: player,
		// 		ready: ready,
		// 		trigger: trigger,
		// 		noteOptions: noteOptions,
		// 		isSampler: isSampler
		// 	};
		// 	return {
		// 		...state,
		// 		[action.payload.layer.id]: layerUpdate
		// 	}
		// case 'EDIT_LAYER_READY':
		// 	return {
		// 		...state,
		// 		[action.payload.layer.id]: {
		// 			...state[action.payload.layer.id],
		// 			ready: action.payload.ready
		// 		}
		// 	}
		case 'EDIT_LAYER_DETAIL':
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
					status: "inactive"
				}
			}
		default:
			return state;
	}
}