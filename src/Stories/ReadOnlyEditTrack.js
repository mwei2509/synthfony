import React, { Component } from 'react';
import SidebarControls from './SidebarControls';
import CreateTrack from '../TrackMaker/CreateTrack';
import './style.css';
// no saving
export default class CreateEditTrackWrapper extends Component {
	render() {
		return (
			<div className='CreateEditTrack container'>
				<SidebarControls readOnly={true}/>
				<CreateTrack {...this.props} />
			</div>
		);
	}
}