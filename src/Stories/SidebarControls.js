import React, { Component } from 'react';
import Playback from '../Playback/index';
import TrackDetails from '../TrackMaker/TrackDetails'
import CreateLayer from '../TrackMaker/Layers/CreateLayer';
import CreateEffect from '../TrackMaker/Effects/CreateEffect';
import SaveTrack from '../TrackMaker/SaveTrack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class SidebarControls extends Component {
	constructor() {
		super();
		this.state = {
			expanded: true
		}
	}
	render() {
		let { readOnly } = this.props;
		let { expanded } = this.state;
		return (
			<div className={`SidebarControls ${expanded ? 'expanded':''}`}>
				<button 
					className="icon" 
					onClick={()=>{this.setState({ expanded: !expanded })}}>
					<FontAwesomeIcon icon="bars" />
				</button>
				{readOnly ? null: <SaveTrack expanded={this.state.expanded} />}	
				<Playback expanded={this.state.expanded} />
				<TrackDetails
					sidebar={true}
					expanded={this.state.expanded} />
				<CreateLayer expanded={this.state.expanded} />
				<CreateEffect expanded={this.state.expanded} />
			</div>
		);
	}
}