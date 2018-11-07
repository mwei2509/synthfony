import { getTimeInMs } from '../utils/functions'

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
		case "NEW_PROJECT":
			return defaultCurrentSelection;
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
	title: '',
	project_id: null,
	public: false,
	bpm: '80',
	beatsPerMeasure: 4,
	pulsePerBeat: 4, // pulse per beats (aka divisions, hardcode for now)
	layer_ids: [],
	effect_ids: [],
	interval: '16n',
	loop: true,
	lastUpdate: null
};

export const manageDetails = (state = trackDetailDefaults, action) => {
	switch(action.type) {
		case "NEW_PROJECT":
			return trackDetailDefaults;
		// case "SET_CURRENT_PROJECT":
		// 	return {
		// 		...state,
		// 		...action.payload
		// 	}
		case "EDIT_TRACK_DETAIL":
			return {
				...state,
				...action.payload
			};
		case "ADD_MEASURE":
			return {
				...state,
				lastUpdate: getTimeInMs()
			}
		case "ADD_NOTE":
			return {...state,
				lastUpdate: getTimeInMs()
			}
		case "ADD_TRACK_BPM":
			return {...state, 
				bpm: action.payload,
				lastUpdate: getTimeInMs()
			};
		case "ADD_EFFECT":
			let { newEffect } = action.payload;
			return {...state, 
				effect_ids: [...state.effect_ids, newEffect.id],
				lastUpdate: getTimeInMs()
			};
		case "ADD_LAYER":
			let { newLayer } = action.payload;
			return {...state, 
				layer_ids: [...state.layer_ids, newLayer.id],
				lastUpdate: getTimeInMs()
			};
		case "CATCH_UP_TRACK":
			let { details } = action.payload;
			return {...details,
				lastUpdate: getTimeInMs()
			};
		case "DEACTIVATE_LAYER":
			return {
				...state,
				layer_ids: state.layer_ids.filter(layer_id => layer_id !== action.payload),
				lastUpdate: getTimeInMs()
			};
		default:
			return state;
	}
}