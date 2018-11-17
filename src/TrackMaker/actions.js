import api from '../api'
import { batchActions } from 'redux-batched-actions';

export const saveTrack = (track_params, goToTrackCallback) => {
	return (dispatch) => {
		api.post('/projects', { project: track_params })
			.then(({data}) => {
				let setCurrentProject= {
					type: 'SET_CURRENT_PROJECT',
					payload: data.data
				}
				dispatch(batchActions([setCurrentProject]));
				goToTrackCallback(data);
			})
			.catch((err) => {
				debugger;
			})
	}
}

export const newProject = () => {
	return {
		type: 'NEW_PROJECT'
	};
}

export const editTrackDetail = (edits) => {
	return {
		type: 'EDIT_TRACK_DETAIL',
		payload: edits
	}
}

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
