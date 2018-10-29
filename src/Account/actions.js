import api from '../api'
import { batchActions } from 'redux-batched-actions';

export const loadUser = (dispatch, {data}) => {
	window.localStorage.setItem("current_user", data.meta.token);
	let setLoginToken = {
		type: 'SET_LOGIN_TOKEN',
		payload: data.meta.token
	}
	let loadUserDetails = {
		type: 'LOAD_USER_DETAILS',
		payload: {
			email: data.data.email,
			user_id: data.data.id,
			username: data.data.username
		}
	}
	dispatch(batchActions([setLoginToken, loadUserDetails]));
}

export const login = ({email, password}) => {
	return (dispatch) => {
		api.post('/sessions', { user: {email: email, password: password} })
			.then(loadUser.bind(this, dispatch))
			.catch(handleSessionError.bind(this, dispatch))
	}
}

export const handleSessionError = (dispatch, error) => {
	debugger;
}

export const register = (user_params) => {
	return (dispatch) => {
		api.post('/users', { user: user_params })
			.then(loadUser.bind(this, dispatch))
			.catch(handleSessionError.bind(this, dispatch))
	}
}

export const clearUser = () => {
	
}

export const logout = (socket) => {
	window.localStorage.clear();
	if (socket) socket.disconnect();
	return {
		type: "LOG_OUT"
	};
}

export const refreshUser = (token) => {
	return (dispatch) => {
		api.post('/sessions/refresh')
			.then(loadUser.bind(this, dispatch))
			.catch(handleSessionError.bind(this, dispatch))
	}
}