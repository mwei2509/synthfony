import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addNote, updateSelection } from './actions';
import Division from './Division';

class Beat extends Component {

	showDivisions() {
		let { beat } = this.props;
		return beat.division_ids.map((div_id, index) => {
			return <Division key={index} divisionId={div_id}/>
		});
	}
	
	isBeingPlayed() {
		let { beat } = this.props;
		let { layerIndices, measureIndices } = this.props.playback;
		// return beatId === currentBeatId;
		let layer = layerIndices[beat.layer_id];
		if (layer === undefined) return;
		if (layer.current_measure !== beat.measure_id) return;
		let measure = measureIndices[beat.measure_id];
		if (measure.current_beat !== beat.id) return;
		return true;
	}

	render() {
		let beingPlayed = this.isBeingPlayed();
		return (
			<div className={'Beat ' + (beingPlayed ? 'being-played':'')}>
				{this.showDivisions()}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return ({
		beat: state.track.beats[ownProps.beatId],
		playback: state.playback,
		layers: state.track.layers
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addNote, updateSelection
	}, dispatch)
}

const ConnectedBeat = connect(mapStateToProps, mapDispatchToProps)(Beat)

export default ConnectedBeat