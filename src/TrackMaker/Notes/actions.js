import { generateIdWithPrefix } from '../../utils/functions';
import { batchActions } from 'redux-batched-actions';

export const addNote = (newNote, division) => {
	newNote.id = generateIdWithPrefix('N');
	newNote.division_id = division.id;
	newNote.beat_id = division.beat_id;
	newNote.measure_id = division.measure_id;
	newNote.layer_id = division.layer_id;
	newNote.div_index = division.div_index;
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
				currentMeasure: newNote.measure_id,
				currentBeat: newNote.beat_id,
				currentDivision: newNote.division_id,
				currentNote: null,
				currentEffect: null
			}
		})
	}
	return batchActions(actions);
}