let defaultAccount = {
	token: window.localStorage.getItem('current_user'),
	loggedIn: !!window.localStorage.getItem('current_user'),
	username: '',
	user_id: null,
	email: ''
};

export const manageAccount = (state = defaultAccount, action) => {
	switch(action.type) {
		case "LOAD_USER_DETAILS":
			return {...state,
				...action.payload
			}
		case "SET_LOGIN_TOKEN":
			return {...state,
				loggedIn: true,
				token: action.payload
			}
		case "LOG_OUT":
			return defaultAccount;
		default:
			return state;
	}
}
export default manageAccount