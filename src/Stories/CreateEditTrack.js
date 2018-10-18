import React, { Component } from 'react';
import SidebarControls from './SidebarControls';
import Layers from '../TrackMaker/Layers';
import './style.css';

export default class CreateEditTrackWrapper extends Component {
	render() {
		return (
			<div className='CreateEditTrack'>
				<SidebarControls />
				<Layers />
			</div>
		);
	}
}