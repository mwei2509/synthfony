import { generateIdWithPrefix } from '../../utils/functions';
import { batchActions } from 'redux-batched-actions';
import { SynthFony } from '../../utils/variables';
import { addPlayerToSynthFony, getNewPlayer } from '../PlayersAndEffects/Load';

const defaultLayer = {
	active: true,
	status: 'normal', // normal, solo, mute - only 
	player: null,
	// player overrides
	type: null,
	settings: {},
	effect_ids: [],
	// measures
	numMeasures: 0,
	noteParts: []
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

export const muteLayer = (layerId) => {
	return {
		type: 'MUTE_LAYER',
		payload: layerId
	}
}

export const soloLayer = (layerId) => {
	return {
		type: 'SOLO_LAYER',
		payload: layerId
	}
}