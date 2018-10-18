import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Beat from './Beat';
import './style.css';

class Measure extends Component {
	getBeats() {
		let { measure } = this.props
		return measure.beat_ids.map((beatId, index) => {
			return <Beat key={index} beatId={beatId} />
		});
	}

	render() {
		return (
			<div className='Measure'>
				{this.getBeats()}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return ({
		measure: state.track.measures[ownProps.measureId]
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
	}, dispatch)
}

const ConnectedMeasure = connect(mapStateToProps, mapDispatchToProps)(Measure)

export default ConnectedMeasure