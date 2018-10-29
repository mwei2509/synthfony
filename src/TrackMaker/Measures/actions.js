import { generateIdWithPrefix } from '../../utils/functions';
import { batchActions } from 'redux-batched-actions';

export const addMeasure = (layer) => {
	// let newMeasure = buildNewMeasure(layer);
	// let newBeats = buildNewBeats(newMeasure);
	// let newDivisions = buildNewDivisions(newBeats);
	return addMeasureToState({
		addMeasureToLayer: layer.id,
		newNumMeasures: layer.numMeasures + 1
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
			payload: payload
		}
	];
	if (fromSelf) {
		actions.push({
			type: 'ADD_MEASURE_TO_BROADCAST',
			payload: payload
		})
		actions.push({
			type: 'UPDATE_CURRENT_SELECTION',
			payload: {
				currentLayer: payload.addMeasureToLayer,
				currentMeasure: payload.newNumMeasures - 1, // length minus 1 = index;
				currentBeat: null,
				currentDivision: null,
				currentNote: null,
				currentEffect: null
			}
		})
	}
	return batchActions(actions);
}

const buildNewMeasure = (layer) => {
	let layerId = layer.id;
	let newMeasureIndex = layer.numMeasures + 1; // added measure
	let measure = {
		layer_id: layerId,
		id: `${layerId}|${newMeasureIndex}`,
		beat_ids: [], 
		type: 'normal', 
		time_signature: '4/4', 
		key: 'none' 
	};
	if (measure.time_signature === '4/4') {
		for (let i = 0; i < 4; i++) {
			let new_beat = `${layerId}|${newMeasureIndex}|${i}`
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
			let new_division = `${beat_id}|${i}`;
			beat.division_ids.push(new_division);
		}
		newBeats[beat_id] = beat;
	})
	return newBeats;
}

const buildNewDivisions = (newBeats) => {
	let newDivisions = {}
	for (var beat_id in newBeats) {
		let beat = newBeats[beat_id];
		beat.division_ids.forEach((div_id) => {
			let division = {
				id: div_id,
				beat_id: beat.id,
				measure_id: beat.measure_id,
				layer_id: beat.layer_id,
				note_ids: [] 
			};
			newDivisions[div_id] = division;
		});
	}
	return newDivisions;
}