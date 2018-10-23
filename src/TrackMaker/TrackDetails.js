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
	render() {
		let { addTrackBpm, details } = this.props;
		if (this.props.expanded) {
			return (
				<div className='track-details'>
					<div className='track-details__bpm'>
						<span className="splitter"></span>
						<span className="sidebar-label title">TRACK DETAILS</span>
						<span className="sidebar-label">Beats Per Minute: {details.bpm}</span>
						<span className="icon" onClick={()=>{addTrackBpm((Number(details.bpm) + 1))}}>
							<FontAwesomeIcon icon="arrow-circle-up" />
							<span className="sidebar-label">increase tempo</span>
						</span>
						<span className="icon" onClick={()=>{addTrackBpm((Number(details.bpm) - 1))}}>
							<FontAwesomeIcon icon="arrow-circle-down" />
							<span className="sidebar-label">decrease tempo</span>
						</span>
						<span className="splitter"></span>
					</div>
				</div>
			)
		}
		return null;
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