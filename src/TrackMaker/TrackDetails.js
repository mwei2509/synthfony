import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTrackBpm } from './actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class TrackDetails extends Component {
	render() {
		let { addTrackBpm, details } = this.props;
							// <input type="range" min="50" max="140" step="1" value={details.bpm} onChange={(e)=>{ addTrackBpm(e.target.value); }} />
		return (
			<div className='track-details'>
				<div className='track-details__bpm'>
					<span className="splitter"></span>
					<span className="icon" onClick={()=>{addTrackBpm((Number(details.bpm) + 1))}}><FontAwesomeIcon icon="arrow-circle-up" /></span>
					<span className="tinyText">BPM: {details.bpm}</span>
					<span className="icon" onClick={()=>{addTrackBpm((Number(details.bpm) - 1))}}><FontAwesomeIcon icon="arrow-circle-down" /></span>
					<span className="splitter"></span>
				</div>
			</div>
		);
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