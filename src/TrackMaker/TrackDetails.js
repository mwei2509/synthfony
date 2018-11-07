import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTrackBpm } from './actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class TrackDetails extends Component {
	getExpanded(msg) {
		if (this.props.expanded) {
			return <span className="sidebar-label">{msg}</span>
		}
		return null;
	}

	renderSidebar() {
		let { addTrackBpm, details } = this.props;
		return (
			<div className='track-details'>
				<button className="icon" onClick={()=>{addTrackBpm((Number(details.bpm) + 1))}}>
					<FontAwesomeIcon icon="arrow-circle-up" />
					{this.getExpanded('increase tempo')}
				</button>
				<button className="icon" onClick={()=>{addTrackBpm((Number(details.bpm) - 1))}}>
					<FontAwesomeIcon icon="arrow-circle-down" />
					{this.getExpanded('decrease tempo')}
				</button>
			</div>
		)
	}

	render() {
		let { addTrackBpm, details } = this.props;
		if (this.props.sidebar) {
			return this.renderSidebar()
		}
		return <div className='track-details-main'>
			<span>BPM: {details.bpm}<br />
				Pulse per beat: {details.pulsePerBeat}<br />
				Beats per measure: {details.beatsPerMeasure}</span>
		</div>
	}
}

const mapStateToProps = (state) => {
	return ({
		details: state.track.details
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addTrackBpm
	}, dispatch)
}

const ConnectedTrackDetails = connect(mapStateToProps, mapDispatchToProps)(TrackDetails)

export default ConnectedTrackDetails