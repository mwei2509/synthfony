import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeArrayWithIndex } from '../../utils/functions'
import Beat from '../Beats/Beat';
import './style.css';

class Measure extends Component {
	getBeats() {
		let { layerId, measureIndex, beatsPerMeasure } = this.props
		return makeArrayWithIndex(beatsPerMeasure).map((index) => {	
			return <Beat
				layerId={layerId}
				measureIndex={measureIndex}
				beatIndex={index}
			/>
		})
		// return measure.beat_ids.map((beatId, index) => {
		// 	return <Beat measureIndex={measureIndex} beatIndex={index} beatId={beatId} />
		// });
	}

	render() {
		let { selected } = this.props;
		return (
			<div className={`Measure ${selected ? 'Expanded':''}`}>
				{this.getBeats()}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let layerSelected = state.track.currentSelection.currentLayer === ownProps.layerId;
	let measureSelected = state.track.currentSelection.currentMeasure === ownProps.measureIndex;
	let selected = layerSelected && measureSelected;

	return ({
		selected: selected,
		beatsPerMeasure: state.track.details.beatsPerMeasure
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
	}, dispatch)
}

const ConnectedMeasure = connect(mapStateToProps, mapDispatchToProps)(Measure)

export default ConnectedMeasure