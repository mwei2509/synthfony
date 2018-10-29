export const manageDivisions = (state = {}, action) => {
	switch(action.type) {
		// case "ADD_NOTE":
		// 	let { newNote } = action.payload;
		// 	return {
		// 		...state,
		// 		[newNote.division_id]: {
		// 			...state[newNote.division_id],
		// 			note_ids: [...state[newNote.division_id].note_ids, newNote.id]
		// 		}
		// 	}
		// case "ADD_MEASURE":
		// 	let { newDivisions } = action.payload;
		// 	if (newDivisions) {
		// 		return {...state, ...newDivisions};
		// 	}
		// 	return state;
		// case "CATCH_UP_TRACK":
		// 	let { divisions } = action.payload;
		// 	return divisions;
		// case "DELETE_LAYER":
		// 	return action.payload.newDivisions;
		default:
			return state;
	}
}