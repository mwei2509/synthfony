import openSocket from 'socket.io-client'

let defaultSocket = {
	socket: null,
	userId: null
};

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

export const manageSocket = (state = defaultSocket, action) => {
	switch(action.type) {
		case 'CONNECT_TO_SOCKET':
			return {
				...state,
				socket: openSocket('http://localhost:4000'),
				// socket: openSocket('https://hidden-wildwood-51567.herokuapp.com/')
			}
		case 'CONNECT_USER':
			if (!state.socket) return state;
			state.socket.emit('add_user_to_room', {userId: action.payload.userId, room: action.payload.room})
			return {
				...state,
				userId: action.payload.userId,
				room: action.payload.room
			}
		case 'ADD_LAYER_TO_BROADCAST':
			if (!state.socket) return state;
			let { id, measure_ids, type } = action.payload.newLayer
			let formattedLayer = {
				userId: state.userId,
				room: state.room,
				layerId: id,
				type: type
			}
			state.socket.emit('add_layer', JSON.stringify(formattedLayer))
			return state;
		case 'ADD_MEASURE_TO_BROADCAST':
			if (!state.socket) return state;
			let formattedMeasure = {	
				userId: state.userId,	
				room: state.room,		
				newMeasure: action.payload.newMeasure,
				newBeats: action.payload.newBeats,
				newDivisions: action.payload.newDivisions,
				indexAt: action.payload.indexAt,
				type: action.payload.type,
				addedMeasures: action.payload.addedMeasures
			};
			state.socket.emit('add_measure', JSON.stringify(formattedMeasure))
			return state;
		case 'ADD_NOTE_TO_BROADCAST':
			if (!state.socket) return state;
			let formattedNote = {...action.payload.newNote,
				userId: state.userId,
				room: state.room
			};
			state.socket.emit('add_note', JSON.stringify(formattedNote))
			return state;
		case 'PEER_UPDATE':
			let track = action.payload;
			let formattedTrack = {
				beats: track.beats,
				details: track.details,
				divisions: track.divisions,
				notes: track.notes,
				measures: track.measures,
				userId: state.userId,
				room: state.room,
				layers: {}
			}
			for (var layerId in track.layers) {
				if (track.layers.hasOwnProperty(layerId)) {
					let layer = track.layers[layerId];
					formattedTrack.layers[layerId] = {
						layerId: layer.id,
						type: layer.type,
						measure_ids: layer.measure_ids
					}
				}
			}
			state.socket.emit('peer_update', JSON.stringify(formattedTrack))
			return state;
		case 'EDIT_LAYER_DETAIL_BROADCAST':
			if (!state.socket) return state;
			state.socket.emit('edit_layer_detail', JSON.stringify({
				userId: state.userId,
				room: state.room,
				layerId: action.payload.layerId,
				change: action.payload.change
			}));
			return state;
		default:
			return state;
	}
}
export default manageSocket