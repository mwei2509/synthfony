import React, { Component } from 'react';
import SidebarControls from './SidebarControls';
import Layers from '../TrackMaker/Layers/Layers';
import './style.css';

export default class CreateEditTrackWrapper extends Component {
	render() {
		return (
			<div className='CreateEditTrack container'>
				<SidebarControls />
				<Layers />
			</div>
		);
	}
}