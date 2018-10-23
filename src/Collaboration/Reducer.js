import openSocket from 'socket.io-client'
import { API_URL } from '../utils/variables';

let defaultSocket = {
	socket: null,
	userId: null
};

export const manageSocket = (state = defaultSocket, action) => {
	switch(action.type) {
		case 'CONNECT_TO_SOCKET':
			return {
				...state,
				socket: openSocket(API_URL),
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
			let formattedLayer = {
				...action.payload.newLayer,
				userId: state.userId,
				room: state.room,
				player: null
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
			let formattedTrack = {
				...action.payload,
				userId: state.userId,
				room: state.room
			}
			state.socket.emit('peer_update', JSON.stringify(formattedTrack))
			return state;
		case 'EDIT_LAYER_BROADCAST':
			if (!state.socket) return state;
			let formattedChange = {
				...action.payload.change,
				player: null
			};
			state.socket.emit('edit_layer', JSON.stringify({
				userId: state.userId,
				room: state.room,
				layerId: action.payload.layerId,
				change: formattedChange
			}));
			return state;
		case 'EDIT_NOTE_BROADCAST':
			if (!state.socket) return state;
			state.socket.emit('edit_note', JSON.stringify({
				userId: state.userId,
				room: state.room,
				noteId: action.payload.noteId,
				change: action.payload.change
			}))
			return state;
		default:
			return state;
	}
}
export default manageSocket