import React, { Component } from 'react';
import Collab from '../Collaboration/index';
import Notifications from '../Notifications/index';
import CreateTrack from '../TrackMaker/CreateTrack';
import SidebarControls from './SidebarControls';

export default class CollabTrack extends Component {

	render() {
		// collab tracks should have notifications layer + comment/update feeds
		return (
			<Collab {...this.props}>
				<Notifications />
				<SidebarControls />
				<CreateTrack {...this.props} />
			</Collab>
		);
	}
}