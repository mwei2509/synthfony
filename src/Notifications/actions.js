import { generateIdWithPrefix } from '../utils/functions';

export const addNotification = (notification) => {
	return (dispatch) => {
		let id = generateIdWithPrefix('notification');
		dispatch({
			type: 'ADD_NOTIFICATION',
			payload: {
				id: id,
				msg: notification
			}
		})
		window.setTimeout(() => {
			dispatch({
				type: 'EXPIRE_NOTIFICATION',
				payload: id
			})
		}, 3000);
	}
}