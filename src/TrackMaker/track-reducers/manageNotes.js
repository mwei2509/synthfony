export const manageNotes = (state = {}, action) => {
	switch(action.type) {
		case "ADD_NOTE":
			// payload is note object
			let { newNote } = action.payload;
			return {...state, [newNote.id]: newNote };
		case "DELETE_NOTE":
			// payload is id to delete
			let stateCopy = Object.assign(state);
			delete stateCopy[action.payload];
			return stateCopy;
		case "CATCH_UP_TRACK":
			let { notes } = action.payload;
			return notes;
		case "DELETE_LAYER":
			let { newNotes } = action.payload;
			return newNotes;
		case "EDIT_NOTE":
			return {
				...state,
				[action.payload.noteId]: {
					...state[action.payload.noteId],
					...action.payload.changes
				}
			}
		default:
			return state;
	}
}