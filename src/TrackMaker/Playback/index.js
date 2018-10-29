import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setStopStatus, updateIndices } from './actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SynthFony } from '../../utils/variables';
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
		this.measureIndex = 0;
		this.beatIndex = 0;
		this.divisionIndex = 0;
		// this.subDivisionIndex = 0;
		/*
			when we allow more meters, the loop should be the equivalent of '32n' for the meter??
			figure out how to account for triplets.																																																																																																																																															
		*/
		this.loop = new Tone.Loop(this.playNotes, '16n').start(0);
		Tone.Transport.bpm.value = bpm;
		Tone.Transport.start();
	}

	playNotes() {
		let { divisions, notes, layers, updateIndices } = this.props;
		let { bpm, beatsPerMeasure, pulsePerBeat, layer_ids } = this.props.details;

		Tone.Transport.bpm.value = bpm;
		updateIndices({
			measureIndex: this.measureIndex,
			beatIndex: this.beatIndex,
			divisionIndex: this.divisionIndex,
			currentTrackDivision: this.index
		});
	
		this.playIndexNotes();
		this.getNextIndexes();
	}
	
	playIndexNotes() {
		let { layers, measures, beats, divisions, notes } = this.props;
		let { layer_ids } = this.props.details;
			layer_ids.forEach((layer_id) => {
			let layer = layers[layer_id];
			if (!layer || !layer.active || layer.status === 'mute') return;
			let measureId = layer.measure_ids[this.measureIndex];
			let measure = measures[measureId];
			if (!measure) return;
			let beatId = measure.beat_ids[this.beatIndex];
			let beat = beats[beatId];
			if (!beat) return;
			let divisionId = beat.division_ids[this.divisionIndex];
			let division = divisions[divisionId];
			if (!division) return;
			let notesToPlay = division.note_ids;
			notesToPlay.forEach((note_id) => {
				let note = notes[note_id];
				layer.player.trigger(note.note, note.duration);
			})
		});
	}

	getNextIndexes() {
		let { pulsePerBeat, beatsPerMeasure } = this.props.details
		this.divisionIndex += 1;
		this.index += 1;
		if (this.divisionIndex > (pulsePerBeat - 1)) {
			// increase beat
			this.divisionIndex = 0;
			this.beatIndex += 1;
			if (this.beatIndex > (beatsPerMeasure - 1)) {
				// increase measure
				this.beatIndex = 0;
				this.measureIndex += 1;
				if (!this.nextMeasureExists()) {
					// set back to 0;
					this.measureIndex = 0;
					this.index = 0;
				}
			}
		}
	}

	// loop through layers to make sure there is a layer with that measure index, returns true immediately if found
	nextMeasureExists(measureIndex) {
		// let { layers } = this.props;
		// let { layer_ids } = this.props.details;
		// for (let i = 0; i < layer_ids.length; i++) {
		// 	let layer = layers[layer_ids[i]];
		// 	if (layer.measure_ids[this.measureIndex]) {
		// 		return true;
		// 	}
		// }
		return false;
	}

	stopSequence() {
		let { setStopStatus } = this.props;
		setStopStatus(true);
		Tone.Transport.stop();
		if (this.loop) {
			this.loop.stop();
		}
	}
	
	getExpandedLabel(msg) {
		if (this.props.expanded) {
			return <span className="sidebar-label">{msg}</span>
		}
		return null;
	}

	render() {
		return (
			<div className='Playback'>
				<span className="icon" onClick={this.startSequence}>
					<FontAwesomeIcon icon="play-circle" />
					{this.getExpandedLabel('Play Track')}
				</span>
				<span className="icon" onClick={this.stopSequence}>
					<FontAwesomeIcon icon="pause-circle" />
					{this.getExpandedLabel('Pause Track')}
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