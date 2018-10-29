let defaultCurrentProject = {
	title: '',
	slug: '',
	project_id: null,
	user: {
		username: ''
	},
	// user_id: null,
	track_json: '' // parsed version of this goes into trackmaker
};

export const manageCurrentProject = (state = defaultCurrentProject, action) => {
	switch(action.type) {
		case 'SET_CURRENT_PROJECT':
			return action.payload;
		default:
			return state;
	}
}
export default manageCurrentProject