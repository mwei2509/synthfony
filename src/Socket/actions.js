export const connectToSocket = () => {
	return {
		type: 'CONNECT_TO_SOCKET'
	}
}

export const connectUser = (userId, room) => {
	return {
		type: 'CONNECT_USER',
		payload: {
			userId: userId,
			room: room
		}
	}
}

export const peerUpdate = (track) => {
	return {
		type: 'PEER_UPDATE',
		payload: track
	}
}