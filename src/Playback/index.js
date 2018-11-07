import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setStopStatus } from './actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Master from './Master'
import './style.css';

class Playback extends Component {
	constructor() {
		super();
		this.startSequence = this.startSequence.bind(this);
		this.stopSequence = this.stopSequence.bind(this);
	}
	
	startSequence() {
		this.props.setStopStatus(false);
	}

	stopSequence() {
		this.props.setStopStatus(true);
	}
	
	getExpandedLabel(msg) {
		if (this.props.expanded) {
			return <span className="sidebar-label">{msg}</span>
		}
		return null;
	}

	render() {
		if (this.props.isMaster) {
			return <Master />
		}
		return (
			<div className='Playback'>
				<button className="icon" disabled={!this.props.hasNotes} onClick={this.startSequence}>
					<FontAwesomeIcon icon="play-circle" />
					{this.getExpandedLabel('Play Track')}
				</button>
				<button className="icon" disabled={!this.props.hasNotes} onClick={this.stopSequence}>
					<FontAwesomeIcon icon="pause-circle" />
					{this.getExpandedLabel('Pause Track')}
				</button>
			</div>
		);
	}
}

const trackHasNotes = (state) => {
	let layer_ids = state.track.details.layer_ids;
	if (layer_ids.length === 0) {
		return false
	} 
	if (layer_ids.length > 0) {
		for (let i = 0; i < layer_ids.length; i++) {
			let layer = state.track.layers[layer_ids[i]];
			let notes = layer.noteParts;
			if (notes.length > 0) {
				return true;
			}
		}
	}
	return false;
}

const mapStateToProps = (state) => {
	return ({
		hasNotes: trackHasNotes(state)
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setStopStatus
	}, dispatch)
}

const ConnectedPlayback = connect(mapStateToProps, mapDispatchToProps)(Playback)

export default ConnectedPlayback