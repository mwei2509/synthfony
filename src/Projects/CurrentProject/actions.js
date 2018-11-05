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
/**
 * Updates object with effects and layers with tone players
 */
const loadNewEffectsAndPlayers = (settings) => {
	clearPlayer();
	for (let effectId in settings.effects) {
		if (settings.effects.hasOwnProperty(effectId)) {
			let effect = settings.effects[effectId];
			let player = getNewEffect(effect.type, {
				settings: effect.settings
			});
			effect.player = player;
			SynthFony.Effects[effectId] = player;
		}
	}
	for (let layerId in settings.layers) {
		if (settings.layers.hasOwnProperty(layerId)) {
			let layer = settings.layers[layerId];
			let player = getNewPlayer(layer.type, null, {
				effect_ids: layer.effect_ids	,
				settings: layer.settings,
				noteParts: layer.noteParts
			});
			layer.player = player;
		}
	}
}
export const loadProjectIntoPreview = (currentProject) => {
	let parsedTrack = JSON.parse(currentProject.track_json);
	loadNewEffectsAndPlayers(parsedTrack);
	return parsedTrack;
}
export const loadProjectIntoTrack = (currentProject, callback) => {
	let parsedTrack = JSON.parse(currentProject.track_json);
	loadNewEffectsAndPlayers(parsedTrack);
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