let defaultCurrentSelection = {
	currentLayer: null, // layer id
	currentMeasure: null, // measure id
	currentBeat: null, // beat id
	currentDivision: null, // index of division
	currentNote: null
};
export const manageCurrentSelection = (state = defaultCurrentSelection, action) => {
	switch(action.type) {
		case 'UPDATE_CURRENT_SELECTION':
			return action.payload;
		case 'ADD_MEASURE':
			let { newMeasure } = action.payload
			return {
				currentLayer: newMeasure.layer_id,
				currentMeasure: newMeasure.id,
				currentBeat: null,
				currentDivision: null,
				currentNote: null
			};
		case 'ADD_LAYER':
			let { newLayer } = action.payload
			return {
				currentLayer: newLayer.id,
				currentMeasure: null,
				currentBeat: null,
				currentDivision: null
			}
		case 'EDIT_LAYER_DETAIL':
			return {
				currentLayer: action.payload.layerId,
				currentMeasure: null,
				currentBeat: null,
				currentDivision: null,
				currentNote: null
			}
		case 'ADD_NOTE':
			return {
				currentLayer: action.payload.newNote.layer_id,
				currentMeasure: action.payload.newNote.measure_id,
				currentBeat: action.payload.newNote.beat_id,
				currentDivision: action.payload.newNote.division_id,
				currentNote: null
				// currentNote: action.payload.newNote.id
			}
		// case "DELETE_LAYER":
			// let { currentSelection } = action.payload;
			// return currentSelection;
		case "DEACTIVATE_LAYER":
			if (state.currentLayer === action.payload) {
				return defaultCurrentSelection;
			}
			return state;
		case "DESELECT_ITEMS":
			return {
				...state,
				...action.payload
			};
		default:
			return state;
	}
}