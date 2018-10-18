import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addNote, addMeasure, editNote, updateSelection } from '../actions';
import Piano from '../../Instruments/Piano';
import Drums from '../../Instruments/Drums';
import AudioVisualization from '../../AudioVisualization/index'
import LayerControls from './LayerControls'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class PlayMode extends Component {
	constructor() {
		super()
		this.state = {
			playMode: false,
			minify: false,
			defaultDuration: '16n',
			defaultInterval: '16n'
		}
		this.toggleMinify = this.toggleMinify.bind(this);
		this.playNote = this.playNote.bind(this);
		this.togglePlaymode = this.togglePlaymode.bind(this);
		this.selectNextInterval = this.selectNextInterval.bind(this);
	}
	togglePlaymode() {
		this.setState({
			playMode: !this.state.playMode
		})
	}
	playNote(note) {
		let { layer, beats, measures, divisions, addNote, editNote } = this.props;
		let { stop } = this.props.playback;
		let { playMode, defaultInterval } = this.state;
		let { currentDivision, currentNote } = this.props.currentSelection;

		if (!stop && playMode) {
			let division = this.getDivision();
			addNote({note: note, duration: this.state.defaultDuration}, division);
		} else if (currentNote) {
			editNote(currentNote, {note: note});
		} else if (currentDivision) {
			addNote({note: note, duration: this.state.defaultDuration}, divisions[currentDivision]);
			this.selectNextInterval()
		}
		layer.trigger(layer, note, this.state.defaultDuration);
	}
	selectNextInterval() {
		let { addMeasure } = this.props;
		let { layer } = this.props;
	
		let nextDivisionId = this.getNextDivisionId();
		if (nextDivisionId.indexOf('new_measure') > -1) {
			let offset = Number(nextDivisionId.split('|')[1]);
			addMeasure(layer, layer.id);
			window.setTimeout(() => {
				this.selectNextInterval(offset);
			})
		} else {
			window.setTimeout(() => {
				this.setDivision(nextDivisionId);
			});
		}
	}
	setDivision(id) {
		let { updateSelection, divisions } = this.props;
		let division = divisions[id];
		updateSelection({
			currentLayer: division.layer_id,
			currentMeasure: division.measure_id,
			currentBeat: division.beat_id,
			currentDivision: division.id,
			currentNote: null
		});
		
	}
	getNextDivisionId(offset) {
		offset = offset || 0;
		let { defaultInterval } = this.state;
		let { layer, measures, beats, divisions } = this.props;
		let { currentMeasure, currentBeat, currentDivision } = this.props.currentSelection;
		if (defaultInterval === '0') {
			return currentDivision;
		}
		let nextBeat, nextId;
		if (defaultInterval === '16n' || defaultInterval === '8n') {
			// if currentBeat is null, new measure was just made
		}
		let increment = ((i)=>{
			switch(i) {
				case '16n': return 1;
				case '8n': return 2;
				case '4n': return 4;
				case '2n': return 8;
				case '1n': return 16;
				default: return 1;
			}
		})(defaultInterval);
		if (currentBeat === null) {
			nextBeat = measures[currentMeasure].beat_ids[offset];
			return beats[nextBeat].division_ids[offset];
		}
		// get next 16th note
		nextId = this.getNextInLine(beats[currentBeat].division_ids, currentDivision, increment);
		if (nextId !== 'next') {
			return nextId;
		}
		// get next beat
		nextId = this.getNextInLine(measures[currentMeasure].beat_ids, currentBeat)
		if (nextId !== 'next') {
			return beats[nextId].division_ids[offset];
		}
		// get next measure
		nextId = this.getNextInLine(layer.measure_ids, currentMeasure);
		if (nextId !== 'next') {
			nextBeat = measures[nextId].beat_ids[offset];
			return beats[nextBeat].division_ids[offset];
		}
		return 'new_measure|0';
	}

	getNextInLine(arrayOfIds, currentId, increment) {
		increment = increment || 1;
		let index = arrayOfIds.indexOf(currentId);
		if ((index + increment) <= arrayOfIds.length - 1) {
			return arrayOfIds[index + increment];
		}
		return 'next';
	}

	// playmode - get division based on currentTrackDivision
	getDivision() {
		let { layer, measures, beats, divisions } = this.props;
		let { currentTrackDivision } = this.props.playback;
		let { measureIndex, beatIndex, divIndex } = this.getMeasureIndex(currentTrackDivision, layer.measure_ids.length);
		let measureId = layer.measure_ids[measureIndex];
		let beatId = measures[measureId].beat_ids[beatIndex];
		let divId = beats[beatId].division_ids[divIndex];
		return divisions[divId];
	}
	getDefaultTime(type) {
		return <div className={type}>
				<label>{type}</label>
				<select value={this.state[type]}
					onChange={(e)=>{ this.setState({ [type]: e.target.value }); }}>
					{type === 'defaultInterval' ? <option value='0'>'same note'</option>: <option value='32n'>'32n'</option>}
					<option value='16n'>'16n'</option>
					<option value='8n'>'8n'</option>
					<option value='4n'>'4n'</option>
					<option value='2n'>'2n'</option>
					<option value='1n'>'1n'</option>
				</select>
			</div>
	}
	getMeasureIndex(divIndex, numMeasures) {
		// let beatsPerMeasure = 4;
		let ppb = 4; // pulse per beat
		let ppm = 16; // pulse per measure, aka div per measures
		for (let i = 0; i < numMeasures; i++) {
			let min = i * ppm; //inclusive
			let max = ((i+1) * ppm) - 1; //inclusive
			if (divIndex >= min && divIndex <= max) {
				let numBeats = 4; // 4 beats per measure
				for (let k = 0; k < numBeats; k++) {
					let minBeat = (k * ppb) + min;
					let maxBeat = (((k+1) * ppb) - 1) + min;
					if (divIndex >= minBeat && divIndex <= maxBeat) {
						return {
							measureIndex: i,
							beatIndex: k,
							divIndex: divIndex - minBeat
						}
					}
				}
			}
		}
	}
	
	getInstrument() {
		let { layer } = this.props;
		switch(layer.type) {
			case 'bass': return <Piano playNote={this.playNote}/>;
			case 'piano': return <Piano playNote={this.playNote}/>;
			case 'kick': return <Piano playNote={this.playNote}/>;
			case 'synth': return <Piano playNote={this.playNote}/>;
			case 'membrane': return <Piano playNote={this.playNote}/>;
			case 'snare': return <Piano playNote={this.playNote}/>;
			default: return <Drums playNote={this.playNote} layer={layer}/>
		}
	}
	toggleMinify() {
		this.setState({
			minify: !this.state.minify
		})
	}
	getExpandedPlaymode() {
		return (
			<div>
			{this.getDefaultTime('defaultDuration')}
			{this.getDefaultTime('defaultInterval')}
			<span onClick={this.selectNextInterval}>skip</span>
			{this.getInstrument()}
			{<LayerControls layer={this.props.layer} />}
			</div>
		)
	}
	render() {
		// <span onClick={this.togglePlaymode}>{this.state.playMode ? 'turn off play mode':'turn on play mode'}</span>
		let minified = this.state.minify;
		return (
			<div className='PlayMode'>
				<span className="icon" onClick={this.toggleMinify}><FontAwesomeIcon icon="times" /></span>

				{minified ? null : this.getExpandedPlaymode()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		playback: state.playback,
		currentSelection: state.track.currentSelection,
		divisions: state.track.divisions,
		measures: state.track.measures,
		layers: state.track.layers,
		beats: state.track.beats,
		details: state.track.details
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addNote, editNote, updateSelection, addMeasure
	}, dispatch)
}

const ConnectedPlayMode = connect(mapStateToProps, mapDispatchToProps)(PlayMode)

export default ConnectedPlayMode