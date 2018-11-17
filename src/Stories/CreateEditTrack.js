import React, { Component } from 'react';
import SidebarControls from './SidebarControls';
import CreateTrack from '../TrackMaker/CreateTrack';
import './style.css';

export default class CreateEditTrack extends Component {
	render() {
		return (
			<div className='CreateEditTrack container'>
				<SidebarControls />
				<CreateTrack {...this.props} />
			</div>
		);
	}
}