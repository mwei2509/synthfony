import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Beat from '../Beats/Beat';
import './style.css';

class Measure extends Component {
	getBeats() {
		let { measure } = this.props
		return measure.beat_ids.map((beatId, index) => {
			return <Beat key={index} beatId={beatId} />
		});
	}

	render() {
		let {selected} = this.props;
		return (
			<div className={`Measure ${selected ? 'Expanded':''}`}>
				{this.getBeats()}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let selected = state.track.currentSelection.currentMeasure === ownProps.measureId;
	return ({
		measure: state.track.measures[ownProps.measureId],
		selected: selected
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
	}, dispatch)
}

const ConnectedMeasure = connect(mapStateToProps, mapDispatchToProps)(Measure)

export default ConnectedMeasure