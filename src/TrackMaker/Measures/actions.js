import { generateIdWithPrefix } from '../../utils/functions';
import { batchActions } from 'redux-batched-actions';

export const addMeasure = (layer, layerId) => {
	layerId = layerId || layer.id;
	let newMeasure = buildNewMeasure(layerId);
	let newBeats = buildNewBeats(newMeasure);
	let newDivisions = buildNewDivisions(newBeats, layer);
	return addMeasureToState({
		newMeasure: newMeasure,
		newBeats: newBeats,
		newDivisions: newDivisions,
		indexAt: 'last',
		type: 'normal',
		addedMeasures: layer ? (layer.measure_ids.length + 1) : 1
	}, true)
}

/**
 * Adds measure to track state
 * @param {object} payload
 * @param {bool} fromSelf - if true, broadcast and update selection
 */
export const addMeasureToState = (payload, fromSelf) => {
	var actions = [
		{
			type: 'ADD_MEASURE',
			payload: {
				newMeasure: payload.newMeasure,
				newBeats: payload.newBeats,
				newDivisions: payload.newDivisions,
				indexAt: payload.indexAt,
				type: payload.type
			}
		},
		{
			type: 'ADD_MEASURE_TO_TRACK',
			payload: {
				addedMeasures: payload.addedMeasures
			}
		}
	];
	if (fromSelf) {
		actions.push({
			type: 'ADD_MEASURE_TO_BROADCAST',
			payload: {
				newMeasure: payload.newMeasure,
				newBeats: payload.newBeats,
				newDivisions: payload.newDivisions,
				indexAt: payload.indexAt,
				type: payload.type,
				addedMeasures: payload.addedMeasures
			}
		})
		actions.push({
			type: 'UPDATE_CURRENT_SELECTION',
			payload: {
				currentLayer: payload.newMeasure.layer_id,
				currentMeasure: payload.newMeasure.id,
				currentBeat: null,
				currentDivision: null,
				currentNote: null,
				currentEffect: null
			}
		})
	}
	return batchActions(actions);
}

const buildNewMeasure = (layerId, type) => {
	let measure = {
		layer_id: layerId,
		id: generateIdWithPrefix('M'), 
		beat_ids: [], 
		type: type || 'normal', 
		time_signature: '4/4', 
		key: 'none' 
	};
	if (measure.time_signature === '4/4') {
		for (let i = 0; i < 4; i++) {
			let new_beat = generateIdWithPrefix('B');
			measure.beat_ids.push(new_beat);
		}
	}
	return measure;
}

const buildNewBeats = (newMeasure) => {
	let newBeats = {};
	newMeasure.beat_ids.forEach((beat_id) => {
		let beat = { 
			id: beat_id, 
			measure_id: newMeasure.id,
			layer_id: newMeasure.layer_id,
			division_ids: [] 
		};
		for (let i = 0; i < 4; i++) {
			let new_division = generateIdWithPrefix('D');
			beat.division_ids.push(new_division);
		}
		newBeats[beat_id] = beat;
	})
	return newBeats;
}

const buildNewDivisions = (newBeats, layer) => {
	let newDivisions = {}
	let divIndex = layer ? layer.measure_ids.length * 4 * 4:0; // change with meter
	for (var beat_id in newBeats) {
		let beat = newBeats[beat_id];
		beat.division_ids.forEach((div_id) => {
			let division = {
				div_index: divIndex, //index of the div in relation to the track
				id: div_id,
				beat_id: beat.id,
				measure_id: beat.measure_id,
				layer_id: beat.layer_id,
				note_ids: [] 
			};
			divIndex += 1
			newDivisions[div_id] = division;
		});
	}
	return newDivisions;
}