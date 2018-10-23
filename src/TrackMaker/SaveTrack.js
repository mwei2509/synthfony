import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { generateIdWithPrefix } from '../utils/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css';

class SaveTrack extends Component {
	constructor() {
		super();
		this.saveTrack = this.saveTrack.bind(this);
	}

	saveTrack() {
		localStorage.setItem(generateIdWithPrefix('track'), JSON.stringify(this.props));
	}
	
	loadTrack() {
		debugger;
	}

	render() {
		return (
			<div className='SaveTrack'>
				<span className="icon" onClick={this.saveTrack}>
					<FontAwesomeIcon icon="save" />
					{this.props.expanded ? <span className="sidebar-label">Save Track</span> : null}
				</span>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		details: state.track.details,
		layers: state.track.layers,
		measures: state.track.measures,
		beats: state.track.beats,
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
	}, dispatch)
}

const ConnectedSaveTrack = connect(mapStateToProps, mapDispatchToProps)(SaveTrack)

export default ConnectedSaveTrack