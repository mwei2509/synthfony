let defaultListing = {
	info: {}, // info about the listing, e.g. from_user??
	projects: []
}
export const manageListing = (state = defaultListing, action) => {
	switch(action.type) {
		case "UPDATE_LISTING":
			return action.payload;
		default:
			return state;
	}
}
export default manageListing