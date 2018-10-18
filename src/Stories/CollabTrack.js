import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Playback from '../Playback/index';
import TrackDetails from '../TrackMaker/TrackDetails'
import Layers from '../TrackMaker/Layers';
import CreateLayer from '../TrackMaker/CreateLayer';
import SaveTrack from '../TrackMaker/SaveTrack';
import Piano from '../Instruments/Piano';
import SidebarControls from './SidebarControls';
import Notifications from '../Atoms/Notifications';
import './style.css';
import { connectToSocket, connectUser, addBroadcast, peerUpdate } from '../Socket/actions'
import { addBroadcastLayer, addBroadcastMeasure, addBroadcastNote, 
	addPeerUpdate, addBroadcastLayerType, editLayerReady } from '../TrackMaker/actions'

class CollabTrack extends Component {
	constructor() {
		super()
		this.state = {
			notifications: [],
			users: []
		}
		this.listen = this.listen.bind(this)
	}
	
	componentDidMount() {
		this.props.connectToSocket()
		window.setTimeout(this.listen);
	}

	listen() {
		let { socket, userId } = this.props.connection;
		socket.on('user', (user) => {
			this.connectUserToRoom(user);
		})
		socket.on('new_user_in_room', this.roomUserActivity.bind(this, 'joined'))
		socket.on('user_left_room', this.roomUserActivity.bind(this, 'left'))
		socket.on('add_layer', this.updateTrack.bind(this, 'layer'));
		socket.on('add_measure', this.updateTrack.bind(this, 'measure'));
		socket.on('add_note', this.updateTrack.bind(this, 'note'));
		socket.on('peer_update', this.catchUpFromPeer.bind(this));
		socket.on('edit_layer_detail', this.updateTrack.bind(this, 'edit_layer_detail'));
	}
	connectUserToRoom(user) {
		let { connectUser } = this.props;
		let { room } = this.props.match.params;
		if (!this.userExists()) {
			connectUser(user, room);
		}
		this.addNotification("You have joined a collaboration room")
	}
	roomUserActivity(type, resp) {
		if (this.shouldBroadcast(resp)) {
			this.addNotification("User " + resp.userId + " has " + type + " the room");
			if (type === 'joined') {
				this.peerUpdateForNewUser(resp.userId);
			}
		}
		this.updateRoomUsers(resp.roomUsers);
		let numUsers = resp.roomUsers.length;
		this.addNotification(`There ${numUsers > 1 ? 'are':'is'} ${numUsers} ${numUsers > 1 ? 'people':'person'} in the room`);
	}
	peerUpdateForNewUser(newUser) {
		let { peerUpdate, track } = this.props
		let peerUser = this.state.users.filter((userId) => {
			return userId !== newUser;
		})[0];
		// if peer user is current user
		if (!this.fromDifferentUser(peerUser)) {
			console.log('peer update');
			peerUpdate(track);
		}
	}
	updateRoomUsers(users) {
		this.setState({
			users: users
		})
	}
	addNotification(notification) {
		this.setState({
			notifications: [
				...this.state.notifications,
				notification
			]
		})
		window.setTimeout(()=>{
			let notCopy = [...this.state.notifications];
			notCopy.splice(0,1);
			this.setState({
				notifications: notCopy
			})
		},3000);
	}
	updateTrack(type, data) {
		let { addBroadcastLayer, addBroadcastMeasure, addBroadcastNote, addBroadcastLayerType } = this.props;
		let resp = JSON.parse(data);
		if (this.shouldBroadcast(resp)) {
			switch(type) {
				case 'layer': return addBroadcastLayer(resp);
				case 'measure': return addBroadcastMeasure(resp);
				case 'note': return addBroadcastNote(resp);
				case 'edit_layer_detail': return addBroadcastLayerType(resp, this.playerReady.bind(this, resp.layerId));
			}
		} else {
			console.log('users layer');
		}
	}
	playerReady(layer) {
		let { editLayerReady } = this.props;
		editLayerReady(layer, true);
	}
	catchUpFromPeer(resp) {
		let { addPeerUpdate, editLayerReady } = this.props;
		let data = JSON.parse(resp);
		if (this.shouldBroadcast(data)) {
			addPeerUpdate(resp, (layerId) => {
				editLayerReady(layerId, true);
			});
		}
	}
	shouldBroadcast(resp) {
		return this.fromThisRoom(resp.room) && this.fromDifferentUser(resp.userId);
	}
	fromDifferentUser(broadcastUserId) {
		let { userId } = this.props.connection;
		return broadcastUserId !== userId;
	}
	fromThisRoom(broadcastRoom) {
		let { room } = this.props.match.params;
		return room === broadcastRoom;
	}
	userExists() {
		let { userId } = this.props.connection;
		return !!userId;
	}

	render() {
		return (
			<div className='CollabTrack'>
				<Notifications notifications={this.state.notifications}/>
				<SidebarControls />
				<Layers />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		connection: state.connection,
		track: state.track
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		connectToSocket, connectUser, addBroadcastLayer, addBroadcastMeasure, addBroadcastNote,
		peerUpdate, addPeerUpdate, addBroadcastLayerType, editLayerReady
	}, dispatch)
}

const ConnectedCollabTrack = connect(mapStateToProps, mapDispatchToProps)(CollabTrack)

export default ConnectedCollabTrack