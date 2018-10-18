import React, { Component } from 'react';
import Playback from '../Playback/index';
import TrackDetails from '../TrackMaker/TrackDetails'
import CreateLayer from '../TrackMaker/CreateLayer';
import SaveTrack from '../TrackMaker/SaveTrack';

export default class SidebarControls extends Component {
	render() {
		return (
			<div className='SidebarControls'>
				<SaveTrack />
				<Playback />
				<TrackDetails />
				<CreateLayer />
			</div>
		);
	}
}