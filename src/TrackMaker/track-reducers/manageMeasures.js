let defaultMeasures = {
	/* 
		[measure_id]: { beat_ids: [], time_sig, layer_id, etc}
	*/
};

export const manageMeasures = (state = defaultMeasures, action) => {
	switch(action.type) {
		case 'ADD_MEASURE':
			let { newMeasure } = action.payload;
			return {
				...state,
				[newMeasure.id]: newMeasure
			};
		case "CATCH_UP_TRACK":
			let { measures } = action.payload;
			return measures
		case "DELETE_LAYER":
			let { newMeasures } = action.payload;
			return newMeasures;
		default:
			return state;
	}
}