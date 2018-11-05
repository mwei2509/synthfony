// reducer is used for all listings
let defaultListing = {
	info: {
		type: '',
		lastUpdated: null
	},
	projects: []
}

// compares state type to action payload type
function isListingType(state, payload) {
	return state.info.type === payload.info.type;
}

function updateIfCorrectType(state, action, callback) {
	if (!isListingType(state, action.payload)) {
		return state;
	}
	return callback();
}
export const manageListing = (type, state = defaultListing, action) => {
	state.info.type = type;

	switch(action.type) {
		case "UPDATE_LISTING":
			return updateIfCorrectType(state, action, () => {
				return action.payload;
			});
		default:
			return state;
	}
}