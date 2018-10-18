import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setStopStatus, updateIndices } from './actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tone from 'tone'
import './style.css';

class Playback extends Component {
	constructor() {
		super();
		
		this.startSequence = this.startSequence.bind(this);
		this.stopSequence = this.stopSequence.bind(this);
		this.startLoop = this.startLoop.bind(this);
		this.playNotes = this.playNotes.bind(this);
	}
	
	startSequence() {
		let { track, setStopStatus } = this.props;
		setStopStatus(false);
		this.startLoop();
	}
	
	startLoop() {
		let { bpm } = this.props.details;
		this.index = 0;
		this.loop = new Tone.Loop(this.playNotes, '16n').start(0);
		Tone.Transport.bpm.value = bpm;
		Tone.Transport.start();
	}

	playNotes(time) {
		let { divisions, notes, layers, updateIndices } = this.props;
		let { bpm, beatsPerMeasure, pulsePerBeat, layer_ids } = this.props.details;

		let numMeasures = layer_ids.reduce((acc, cur) => {
			if (layers[cur].measure_ids.length > acc) {
				return layers[cur].measure_ids.length;
			}
			return acc;
		}, 0);
		let numDivisions = numMeasures * beatsPerMeasure * pulsePerBeat;

		Tone.Transport.bpm.value = bpm;
		updateIndices({currentTrackDivision: this.index});
	
		this.getNotesToPlay(this.index).forEach((note_id) => {
			let note = notes[note_id];
			let layer = layers[note.layer_id];
			layer.trigger(layer, note.note, note.duration);
		})
		if (this.index >= numDivisions - 1) {
			this.index = 0;
		} else {
			this.index += 1
		}
	}

	getNotesToPlay(index) {
		// flattens notes
		let indexDivIds = this.props.details.divisions[index];
		let { divisions, layers } = this.props;
		if (indexDivIds) {			
			return indexDivIds.filter((div_id) => {
				let division = divisions[div_id];
				let layer = layers[division.layer_id];
				return layer.status === 'active';
			})
			.map((div_id) => {
				return divisions[div_id].note_ids;
			})
			.reduce((acc, val) => acc.concat(val), []);
		}
		return [];
	}
	
	stopSequence() {
		let { setStopStatus } = this.props;
		setStopStatus(true);
		if (this.loop) {
			this.loop.stop();
		}
	}

	render() {
		return (
			<div className='Playback'>
				<span className="icon" onClick={this.startSequence}><FontAwesomeIcon icon="play-circle" /></span>
				<span className="icon" onClick={this.stopSequence}><FontAwesomeIcon icon="pause-circle" /></span>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		details: state.track.details,
		layers: state.track.layers,
		divisions: state.track.divisions,
		notes: state.track.notes
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setStopStatus, updateIndices
	}, dispatch)
}

const ConnectedPlayback = connect(mapStateToProps, mapDispatchToProps)(Playback)

export default ConnectedPlayback