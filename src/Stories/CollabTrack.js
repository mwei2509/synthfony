import React, { Component } from 'react';
import Collab from '../Collaboration/index';
import Notifications from '../Notifications/index';
import Layers from '../TrackMaker/Layers/Layers';
import SidebarControls from './SidebarControls';

export default class CollabTrack extends Component {

	render() {
		// collab tracks should have notifications layer + comment/update feeds
		return (
			<Collab {...this.props}>
				<SidebarControls />
				<Notifications />
				<Layers />
			</Collab>
		);
	}
}