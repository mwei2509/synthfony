import { generateIdWithPrefix } from '../utils/functions';
// import { getInstrument } from '../Instruments/LoadPlayers';
import { getInstrument } from '../Instruments/Load';
import { batchActions } from 'redux-batched-actions';
import { Player } from '../Layers/Player';

export const addTrackBpm= (bpm) => {
	return {
		type: 'ADD_TRACK_BPM',
		payload: bpm
	}
}

export const deselectItem = (selection) => {
	return {
		type: 'DESELECT_ITEMS',
		payload: selection
	}
}
export const addNote = (newNote, division) => {
	newNote.id = generateIdWithPrefix('N');
	newNote.division_id = division.id;
	newNote.beat_id = division.beat_id;
	newNote.measure_id = division.measure_id;
	newNote.layer_id = division.layer_id;
	newNote.div_index = division.div_index;
	return addNoteToState(newNote, true);
}
export const editNote = (noteId, changes) => {
	return {
		type: 'EDIT_NOTE',
		payload: {
			noteId: noteId,
			changes: changes
		}
	}
}

export const addBroadcastNote = (broadcastNote) => {
	return addNoteToState(broadcastNote, false)
}
const addNoteToState = (newNote, broadcast) => {
	let actions = [{
		type: 'ADD_NOTE',
		payload: {
			newNote: newNote, 
		}
	}]
	if (broadcast) {
		actions.push({
			type: 'ADD_NOTE_TO_BROADCAST',
			payload: {
				newNote: newNote, 
			}
		})
	}
	return batchActions(actions);
}

export const updateSelection = (updatedSelection) => {
	return {
		type: 'UPDATE_CURRENT_SELECTION',
		payload: updatedSelection
	};
}
// 
// export const editBeat = (beatId, beat, divIndex, updatedVal) => {
// 	let newDivisions = updateArrayAt(beat.divisions, divIndex, updatedVal)
// 	return {
// 		type: 'EDIT_BEAT',
// 		payload: {
// 			divIndex: divIndex,
// 			beatId: beatId,
// 			newDivisions: newDivisions
// 		}
// 	}
// }

// export const addMeasureToSequence = (sequence, newMeasure, beats, indexAt) => {
// 	let measureSequence = makeMeasureSequence(newMeasure, beats);
// 	if (indexAt == undefined) {
// 		return [...sequence, measureSequence];
// 	} else {
// 		return [...sequence].splice(indexAt, 0, ...measureSequence);
// 	}
// }
// 
// export const makeMeasureSequence = (measure, beats) => {
// 	return measure.beat_ids.map((beat_id) => {
// 		return makeBeatSequence(beats, beat_id);
// 	});
// }
// export const updateEntireSequence = (layer, measureMap, beats) => {
// 	let sequence = [];
// 	layer.measure_ids.forEach((measure_id) => {
// 		let measureBeats = makeMeasureSequence(measureMap[measure_id]);
// 		sequence = [...sequence, measureBeats];
// 	});
// 	return sequence;
// }

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

// const updateLayerMeasures = (layer, newMeasureId, measures, beats) => {
// 	let layerCopy = {...layer, measure_ids: layer.measure_ids};
// 	layerCopy.measure_ids.push(newMeasureId);
// 	layerCopy.sequence = updateEntireSequence(layerCopy, measures, beats);
// 	return layerCopy;
// }


// new layer, set up empty sequence
// add measure, layer.sequence.add(beat, index) for each beat
/* 
measure - will be object with info about time measure 
*/
// layerId for new layers
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

export const addBroadcastMeasure = (broadcastMeasure) => {
	return addMeasureToState({
		userId: broadcastMeasure.userId,
		newMeasure: broadcastMeasure.newMeasure,
		newBeats: broadcastMeasure.newBeats,
		newDivisions: broadcastMeasure.newDivisions,
		indexAt: broadcastMeasure.indexAt,
		type: broadcastMeasure.type,
		addedMeasures: broadcastMeasure.addedMeasures
	}, false)
}

const addMeasureToState = (payload, broadcast) => {
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
	if (broadcast) {
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
	}
	return batchActions(actions);
}

/*
	layer - will be object with synth/note/etc information
*/
const defaultLayer = {
	status: 'active',
	measure_ids: []
};
export const addLayer = () => {
	let layer = alterObjWithInstrument(defaultLayer, 'membrane');
	layer.id = generateIdWithPrefix('L');
	layer.measure_ids = [];
	return addLayerToState(layer, true);
}

export const addBroadcastLayer = (broadcastLayer) => {
	let layer = alterObjWithInstrument(defaultLayer, broadcastLayer.type);
	layer.id = broadcastLayer.layerId;
	layer.userId = broadcastLayer.userId;
	layer.measure_ids = [];
	return addLayerToState(layer, false);
}

const addLayerToState = (layer, broadcast) => {
	let actions = [
		{
			type: 'ADD_LAYER',
			payload: {
				newLayer: layer
			}
		}
	];
	if (broadcast) {
		actions.push({
			type: 'ADD_LAYER_TO_BROADCAST',
			payload: {
				newLayer: layer
			}
		})
	}
	return batchActions(actions);
}

export const deactivateLayer = (layerId) => {
	return {
		type: 'DEACTIVATE_LAYER',
		payload: layerId
	}
}

// inactive
export const deleteLayer = (layerId, track) => {
	// edit track details
	let trackMeasures = track.details.numMeasures;
	let layerMeasures = track.layers[layerId].measure_ids.length;
	let numMeasures = 0;
	if (layerMeasures == trackMeasures) {
		// reset num measures
		for (let id in track.layers) {
			if (track.layers.hasOwnProperty(id)) {
				let layer = track.layers[id];
				if (layer.id !== layerId && layer.measure_ids.length > numMeasures) {
					numMeasures = layer.measure_ids.length;
				}
			}
		}
	}
	let layer_ids = track.details.layer_ids.filter((layer_id) => {
		return layer_id !== layerId;
	})

	let newLayers = {};
	for (var id in track.layers) {
		if (track.layers.hasOwnProperty(id)) {
			let layer = track.layers[id];
			if (layer.id != layerId) {
				newLayers[layer.id] = layer;
			}
		}
	}
	
	// maintain references to existing items... hopefully
	let newMeasures = {};
	for (var measureId in track.measures) {
		if (track.measures.hasOwnProperty(measureId)) {
			let measure = track.measures[measureId];
			if (measure.layer_id != layerId) {
				newMeasures[measureId] = measure;
			}
		}
	}
	
	let newBeats = {};
	for (var beatId in track.beats) {
		if (track.beats.hasOwnProperty(beatId)) {
			let beat = track.beats[beatId];
			if (beat.layer_id != layerId) {
				newBeats[beatId] = beat;
			}
		}
	}

	let newDivisions = {};
	let divisions = {...track.details.divisions};
	for (var divisionId in track.divisions) {
		if (track.divisions.hasOwnProperty(divisionId)) {
			let division = track.divisions[divisionId];
			if (division.layer_id != layerId) {
				newDivisions[divisionId] = division;
			} else {
				// delete divisions from index
				let divIndex = division.div_index;
				if (track.details.divisions[divIndex] && track.details.divisions[divIndex].length) {
					divisions[divIndex] = track.details.divisions[divIndex].filter((divId) => {
						return divId !== division.id
					})
				}
			}
		}
	}

	let newNotes = {};
	for (var noteId in track.notes) {
		if (track.notes.hasOwnProperty(noteId)) {
			let note = track.notes[noteId];
			if (note.layer_id != layerId) {
				newNotes[noteId] = note;
			}
		}
	}
	
	let currentSelection = track.currentSelection;
	if (track.currentSelection.currentLayer == layerId) {
		currentSelection = {
			currentLayer: null, // layer id
			currentMeasure: null, // measure id
			currentBeat: null, // beat id
			currentDivision: null, // index of division
			currentNote: null
		}
	}

	return {
		type: 'DELETE_LAYER',
		payload: {
			details: {
				numMeasures: numMeasures,
				layer_ids: layer_ids,
				divisions: divisions
			},
			newLayers: newLayers,
			newMeasures: newMeasures,
			newBeats: newBeats,
			newDivisions: newDivisions,
			newNotes: newNotes,
			currentSelection: currentSelection
		}
	}
}

const alterObjWithInstrument = (obj, type, layerId, callback) => {
	let layerInfo = getInstrument(type, callback);
	debugger;
	// let { player, trigger, notes, ready, meter,
	// 	isSampler, alterPlayer, settings } = getInstrument(type, (callback ? callback.bind(this, layerId) : null))
	return {
		...obj,
		// type: type,
		// player: player,
		// trigger: trigger,
		// noteOptions: notes,
		// ready: ready,
		// isSampler: isSampler,
		// alterPlayer: alterPlayer,
		// settings: settings,
		// meter: meter
	}
}
export const addPeerUpdate = (broadcastJson, callback) => {
	let broadcast = JSON.parse(broadcastJson);
	for (let layerId in broadcast.layers) {
		if (broadcast.layers.hasOwnProperty(layerId)) {
			let layer = broadcast.layers[layerId];
			broadcast.layers[layerId] = alterObjWithInstrument(layer, layer.type, layerId, callback);
			broadcast.layers[layerId].id = layerId;
			delete broadcast.layers[layerId].layerId;
		}
	}
	return {
		type: "CATCH_UP_TRACK",
		payload: {
			beats: broadcast.beats,
			details: broadcast.details,
			divisions: broadcast.divisions,
			measures: broadcast.measures,
			notes: broadcast.notes,
			layers: broadcast.layers
		}
	}
}

export const editLayerType = (layerId, type, callback) => {
	let params = alterObjWithInstrument({}, type, layerId, callback);
	return editLayerDetail(layerId, params, true)
}

export const addBroadcastLayerType = (resp, callback) => {
	let params = alterObjWithInstrument({}, resp.change.type, resp.layerId, callback);
	params.userId = resp.userId;
	params.room = resp.room;
	params.type = resp.change.type;
	return editLayerDetail(resp.layerId, params, false);
}

export const editLayerReady = (layerId, ready) => {
	return editLayerDetail(layerId, {
		ready: ready
	}, false);
}

export const editLayerDetail = (id, change, broadcast) => {
	let actions = [{
		type: 'EDIT_LAYER_DETAIL',
		payload: {
			layerId: id,
			change: change
		}
	}]
	if (broadcast) {
		actions.push({
			type: 'EDIT_LAYER_DETAIL_BROADCAST',
			payload: {
				layerId: id,
				change: change
			}
		})
	}
	return batchActions(actions);
}