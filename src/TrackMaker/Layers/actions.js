import { generateIdWithPrefix } from '../../utils/functions';
import { batchActions } from 'redux-batched-actions';
import { SynthFony } from '../../utils/variables';
import { addPlayerToSynthFony, getNewPlayer } from '../PlayersAndEffects/Load';

const defaultLayer = {
	status: 'active',
	player: null,
	// player overrides
	type: null,
	settings: {},
	effect_ids: [],
	// measures
	measure_ids: []
};

/**
 * Adds new layer with a player
 * @param {object}
 */
export const addPlayerToNewLayer = (player) => {
	let playerParams = getNewLayerParams(player);
	let layer = {
		...defaultLayer,
		...playerParams,
		id: generateIdWithPrefix('L')
	};

	return addLayerToState(layer, true);
}

/**
 * Returns new params altered by new player
 * @param {object} player
 * @returns {object}
 */
export const getNewLayerParams = (player) => {
	// let player = SynthFony.Players[player_id];
	return {
		player: player,
		type: player.details.type,
		ready: player.details.ready,
		instrument: player.details.instrument,
		settings: player.settings,
		effect_ids: player.effect_ids,
		notes: player.notes
	};
}
/**
 * Adds new layer to state
 * @param {object} layer
 * @param {bool} fromSelf if true, broadcast and change current selection
 */
export const addLayerToState = (layer, fromSelf) => {
	let actions = [
		{
			type: 'ADD_LAYER',
			payload: {
				newLayer: layer
			}
		}
	];
	if (fromSelf) {
		actions.push({
			type: 'ADD_LAYER_TO_BROADCAST',
			payload: {
				newLayer: layer
			}
		})
		actions.push({
			type: 'UPDATE_CURRENT_SELECTION',
			payload: {
				currentLayer: layer.id,
				currentMeasure: null,
				currentBeat: null,
				currentDivision: null,
				currentNote: null,
				currentEffect: null
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

export const addLayerDetailToState = (layerId, change, fromSelf) => {
	let actions = [{
		type: 'EDIT_LAYER',
		payload: {
			layerId: layerId,
			change: change
		}
	}]
	if (fromSelf) {
		actions.push({
			type: 'EDIT_LAYER_BROADCAST',
			payload: {
				layerId: layerId,
				change: change
			}
		})
		actions.push({
			type: 'UPDATE_CURRENT_SELECTION',
			payload: {
				currentLayer: layerId,
				currentMeasure: null,
				currentBeat: null,
				currentDivision: null,
				currentNote: null,
				currentEffect: null
			}
		})
	}
	return batchActions(actions);
}

/**
 * Add/change layer detail, always called from self
 * @param {string} layerId
 * @param {object} newDetails
 */
export const editLayerDetail = (layer, newDetails) => {
	// fill in needed things
	if (typeof newDetails.type === 'undefined') {
		newDetails.type = layer.type;
	}
	return addLayerDetailToState(layer.id, newDetails, true);
}

export const editLayerReady = (layerId, ready) => {
	return addLayerDetailToState(layerId, {ready: true}, false);
}

export const editLayerType = (layer, type, callback, override) => {
	let player = getNewPlayer(type, callback, override);
	let updatedLayerParams = getNewLayerParams(player);
	return editLayerDetail(layer, updatedLayerParams, true);
}
/*
const getLayerPlayer = (obj, type, layerId, callback) => {
	let layerInfo = getPlayer(type, callback);
	debugger;
	// let { player, trigger, notes, ready, meter,
	// 	isSampler, alterPlayer, settings } = getPlayer(type, (callback ? callback.bind(this, layerId) : null))
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

// layer - will be object with synth/note/etc information

export const addBroadcastLayer = (broadcastLayer) => {
	let layer = getLayerPlayer(defaultLayer, broadcastLayer.type);
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

export const editLayerType = (layerId, type, callback) => {
	let params = getLayerPlayer({}, type, layerId, callback);
	return editLayerDetail(layerId, params, true)
}

export const addBroadcastLayerType = (resp, callback) => {
	let params = getLayerPlayer({}, resp.change.type, resp.layerId, callback);
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
		type: 'EDIT_LAYER',
		payload: {
			layerId: id,
			change: change
		}
	}]
	if (broadcast) {
		actions.push({
			type: 'EDIT_LAYER_BROADCAST',
			payload: {
				layerId: id,
				change: change
			}
		})
	}
	return batchActions(actions);
}
*/