let defaultNotifications = [];

const manageNotifications = (state = defaultNotifications, action) => {
	switch(action.type) {
		case 'ADD_NOTIFICATION':
			return [
				...state,
				{
					id: action.payload.id,
					msg: action.payload.msg
				}
			]
		case 'EXPIRE_NOTIFICATION':
			return state.filter(notification => notification.id !== action.payload);
		default:
			return state;
	}
}
export default manageNotifications;