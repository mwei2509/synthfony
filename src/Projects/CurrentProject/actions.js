import api from '../../api'
import { batchActions } from 'redux-batched-actions';
import { addLayerToState, addLayerDetailToState } from '../../TrackMaker/Layers/actions';
import { addMeasureToState } from '../../TrackMaker/Measures/actions';
import { addNoteToState, addNoteEditsToState } from '../../TrackMaker/Notes/actions';
import { getNewPlayer, clearPlayer } from '../../TrackMaker/PlayersAndEffects/Load';
import { getNewEffect } from '../../TrackMaker/PlayersAndEffects/Load';
import { SynthFony } from '../../utils/variables'

export const fetchProject = (username, track_slug) => {
	return (dispatch) => {
		api.get(`/projectslug/${username}/${track_slug}`)
			.then(({data}) => {
				let setCurrentProject= {
					type: 'SET_CURRENT_PROJECT',
					payload: data.data
				}
				dispatch(batchActions([setCurrentProject]));
			})
			.catch((err) => { debugger; })
	}
}

export const loadProjectIntoTrack = (currentProject, callback) => {
	let parsedTrack = JSON.parse(currentProject.track_json);
	clearPlayer();
	for (let effectId in parsedTrack.effects) {
		if (parsedTrack.effects.hasOwnProperty(effectId)) {
			let effect = parsedTrack.effects[effectId];
			let player = getNewEffect(effect.type, {
				settings: effect.settings
			});
			effect.player = player;
			SynthFony.Effects[effectId] = player;
		}
	}
	for (let layerId in parsedTrack.layers) {
		if (parsedTrack.layers.hasOwnProperty(layerId)) {
			let layer = parsedTrack.layers[layerId];
			let player = getNewPlayer(layer.type, callback.bind(this, layerId), {
				effect_ids: layer.effect_ids	,
				settings: layer.settings,
				noteParts: layer.noteParts
			});
			layer.player = player;
		}
	}
	return {
		type: "CATCH_UP_TRACK",
		payload: {
			details: parsedTrack.details,
			layers: parsedTrack.layers,
			effects: parsedTrack.effects,
			trackPlay: parsedTrack.trackPlay
		}
	}
}