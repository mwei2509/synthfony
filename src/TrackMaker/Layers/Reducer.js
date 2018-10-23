let defaultLayers = {};

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
					status: "inactive"
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
		default:
			return state;
	}
}