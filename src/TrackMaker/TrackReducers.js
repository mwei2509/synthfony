let defaultCurrentSelection = {
	currentLayer: null, // layer id
	currentMeasure: null, // measure id
	currentBeat: null, // beat id
	currentDivision: null, // index of division
	currentNote: null,
	currentEffect: null
};
export const manageCurrentSelection = (state = defaultCurrentSelection, action) => {
	switch(action.type) {
		case 'UPDATE_CURRENT_SELECTION':
			return action.payload;
		case 'SELECT_EFFECT':
			return {
				...state,
				currentEffect: action.payload
			};
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

let trackDetailDefaults = {
	bpm: '80',
	beatsPerMeasure: 4,
	pulsePerBeat: 4, // pulse per beats (aka divisions, hardcode for now)
	layer_ids: [],
	effect_ids: [],
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
		case "ADD_EFFECT":
			let { newEffect } = action.payload;
			return {...state, effect_ids: [...state.effect_ids, newEffect.id]};
		case "ADD_LAYER":
			let { newLayer } = action.payload;
			return {...state, layer_ids: [...state.layer_ids, newLayer.id]};
		case "CATCH_UP_TRACK":
			let { details } = action.payload;
			return details;
		case "DEACTIVATE_LAYER":
			return {
				...state,
				layer_ids: state.layer_ids.filter(layer_id => layer_id !== action.payload)
			};
		default:
			return state;
	}
}