import { addLayerToState, addLayerDetailToState } from '../TrackMaker/Layers/actions';
import { addMeasureToState } from '../TrackMaker/Measures/actions';
import { addNoteToState, addNoteEditsToState } from '../TrackMaker/Notes/actions';
import { getNewPlayer } from '../TrackMaker/PlayersAndEffects/Load';
import { getNewEffect } from '../TrackMaker/PlayersAndEffects/Load';
import { SynthFony } from '../utils/variables'

export const connectToSocket = () => {
	return {
		type: 'CONNECT_TO_SOCKET'
	}
}

export const connectUser = (userId, room) => {
	return {
		type: 'CONNECT_USER',
		payload: {
			userId: userId,
			room: room
		}
	}
}


export const addPeerUpdate = (broadcastJson, callback) => {
	let broadcast = JSON.parse(broadcastJson);
	for (let effectId in broadcast.effects) {
		if (broadcast.effects.hasOwnProperty(effectId)) {
			let effect = broadcast.effects[effectId];
			let player = getNewEffect(effect.type, {
				settings: effect.settings
			});
			effect.player = player;
			SynthFony.Effects[effectId] = player;
		}
	}
	for (let layerId in broadcast.layers) {
		if (broadcast.layers.hasOwnProperty(layerId)) {
			let layer = broadcast.layers[layerId];
			let player = getNewPlayer(layer.type, callback.bind(this, layerId), {
				effect_ids: layer.effect_ids	,
				settings: layer.settings
			});
			layer.player = player;
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
			layers: broadcast.layers,
			effects: broadcast.effects
		}
	}
}

export const peerUpdate = (track) => {
	let formattedLayers = {};
	// remove players
	for (let id in track.layers) {
		if (track.layers.hasOwnProperty(id)) {
			formattedLayers[id] = {
				...track.layers[id],
				player: null
			}
		}
	}
	let formattedEffects = {};
	for (let id in track.effects) {
		if (track.effects.hasOwnProperty(id)) {
			formattedEffects[id] = {
				...track.effects[id],
				effect: null
			}
		}
	}
	return {
		type: 'PEER_UPDATE',
		payload: {
			...track,
			layers: formattedLayers,
			effects: formattedEffects
		}
	}
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


export const addBroadcastNote = (broadcastNote) => {
	return addNoteToState(broadcastNote, false)
}

/**
 * Adds layer from broadcast to state
 * @param {object} broadcastedLayer
 */
export const addBroadcastLayer = (broadcastedLayer, callback) => {
	broadcastedLayer.player = getNewPlayer(broadcastedLayer.type, callback.bind(this, broadcastedLayer.id), {
		effect_ids: broadcastedLayer.effects,
		settings: broadcastedLayer.settings
	});
	return addLayerToState(broadcastedLayer, false)
}

export const addBroadcastEditLayer = (broadcast, callback) => {
	let layerId = broadcast.layerId;
	let change = broadcast.change;
	change.player = getNewPlayer(change.type, callback.bind(this, layerId), {
		effect_ids: change.effect_ids,
		settings: change.settings
	});
	return addLayerDetailToState(layerId, change, false);
}

export const addBroadcastEditNote = (broadcast) => {
	return addNoteEditsToState(broadcast.noteId, broadcast.change, false);
}