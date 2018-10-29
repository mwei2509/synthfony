import React, { Component } from 'react';
import ReadOnlySidebarControls from './ReadOnlySidebarControls';
import CreateTrack from '../TrackMaker/CreateTrack';
import './style.css';
// no saving
export default class CreateEditTrackWrapper extends Component {
	render() {
		return (
			<div className='CreateEditTrack container'>
				<ReadOnlySidebarControls />
				<CreateTrack {...this.props} />
			</div>
		);
	}
}