import React, { Component } from 'react';
import SidebarControls from './SidebarControls';
import Layers from '../TrackMaker/Layers/Layers';
import ProjectListing from '../Projects/Listing/ProjectListing'
import './style.css';

export default class Homepage extends Component {
	render() {
		return (
			<div className='CreateEditTrack container'>
				<ProjectListing type="homepage"/>
			</div>
		);
	}
}