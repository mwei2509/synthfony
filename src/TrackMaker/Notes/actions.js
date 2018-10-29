import { generateIdWithPrefix } from '../../utils/functions';
import { batchActions } from 'redux-batched-actions';

export const addNote = (newNote) => {
	return addNoteToState(newNote, true);
}

export const addNoteEditsToState = (noteId, change, fromSelf) => {
	let actions = [{
		type: 'EDIT_NOTE',
		payload: {
			noteId: noteId,
			change: change
		}
	}]
	if (fromSelf) {
		actions.push({
			type: 'EDIT_NOTE_BROADCAST',
			payload: {
				noteId: noteId,
				change: change
			}
		})
	}
	return batchActions(actions);
}

export const editNote = (noteId, change) => {
	return addNoteEditsToState(noteId, change, true);
}

export const addNoteToState = (newNote, fromSelf) => {
	let actions = [{
		type: 'ADD_NOTE',
		payload: {
			newNote: newNote, 
		}
	}]
	if (fromSelf) {
		let timeArr = newNote.time.split(':');
		let measureIndex = timeArr[0];
		let beatIndex = timeArr[1];
		let divisionIndex = timeArr[2];
	
		actions.push({
			type: 'ADD_NOTE_TO_BROADCAST',
			payload: {
				newNote: newNote, 
			}
		})
		actions.push({
			type: 'UPDATE_CURRENT_SELECTION',
			payload: {				
				currentLayer: newNote.layer_id,
				currentMeasure: Number(measureIndex),
				currentBeat: Number(beatIndex),
				currentDivision: Number(divisionIndex),
				currentNote: null,
				currentEffect: null
			}
		})
	}
	return batchActions(actions);
}