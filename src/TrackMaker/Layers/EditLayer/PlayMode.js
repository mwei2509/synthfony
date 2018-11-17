import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addNote, editNote } from '../../Notes/actions';
import { updateSelection } from '../../actions';
import { addMeasure } from '../../Measures/actions';
import { editLayerDetail } from '../actions';
import Piano from '../../Instruments/Piano';
import Drums from '../../Instruments/Drums';
import Source from '../../Instruments/Source';
import AudioVisualization from '../../../AudioVisualization/index'
import LayerControls from './LayerControls'
import { SynthFony } from '../../../utils/variables'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class PlayMode extends Component {
	constructor() {
		super()
		this.state = {
			playMode: false,
			defaultDuration: '16n',
			defaultInterval: '0n'
		}
		this.playNote = this.playNote.bind(this);
		this.togglePlaymode = this.togglePlaymode.bind(this);
		this.selectNextInterval = this.selectNextInterval.bind(this);
	}
	togglePlaymode() {
		this.setState({
			playMode: !this.state.playMode
		})
	}
	getTrackTime() {
		let { currentMeasure, currentBeat, currentDivision } = this.props.currentSelection;
		return `${currentMeasure}:${currentBeat}:${currentDivision}`;
	}
	playNote(note) {
		let { layer, addNote, editNote } = this.props;
		let { stop } = this.props.playback;
		let { playMode, defaultInterval } = this.state;
		let { currentDivision, currentNote } = this.props.currentSelection;

		if (!stop && playMode) {
			// let division = this.getDivision();
			// addNote({note: note, duration: this.state.defaultDuration}, division);
		} else if (currentNote) {
			// editNote(currentNote, {note: note});
		} else if (currentDivision !== null) {
			let newNote = {
				layer_id: layer.id,
				time: this.getTrackTime(),
				note: note,
				duration: this.state.defaultDuration
			}
			layer.player.part.add(newNote);
			addNote(newNote);
			this.selectNextInterval()
		}
		layer.player.trigger(note, this.state.defaultDuration);
	}
	selectNextInterval() {
		let { addMeasure } = this.props;
		let { layer } = this.props;
		let currentTime = this.getNextDivisionId();
		if (currentTime === 'new_measure') {
			addMeasure(layer);
			window.setTimeout(() => {
				this.selectNextInterval();
			})
		} else {
			window.setTimeout(() => {
				this.setDivision(currentTime);
			});
		}
	}
	setDivision(currentTime) {
		let { layer } = this.props;
		let { currentDivision, currentMeasure, currentBeat} = currentTime;
		let { updateSelection } = this.props;
		updateSelection({
			currentLayer: layer.id,
			currentMeasure: currentMeasure,
			currentBeat: currentBeat,
			currentDivision: currentDivision,
			currentNote: null
		});
		
	}
	getNextDivisionId() {
		let { defaultInterval } = this.state;
		let { details, layer } = this.props;
		let { currentMeasure, currentBeat, currentDivision } = this.props.currentSelection;
		let currentTime = {
			currentMeasure: currentMeasure,
			currentBeat: currentBeat || 0,
			currentDivision: currentDivision || 0
		};

		if (defaultInterval === '0n') {
			return currentTime;
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

		let { pulsePerBeat, beatsPerMeasure } = details;
		let nextDivision = this.getNextInLine(pulsePerBeat, currentDivision, increment);
		if (nextDivision !== 'next') {
			currentTime.currentDivision = nextDivision;
			return currentTime;
		}
		let nextBeat = this.getNextInLine(beatsPerMeasure, currentBeat);
		if (nextBeat !== 'next'){
			currentTime.currentBeat = nextBeat;
			currentTime.currentDivision = 0;
			return currentTime;
		}
		let nextMeasure = this.getNextInLine(layer.numMeasures, currentMeasure);
		if (nextMeasure !== 'next') {
			currentTime.currentMeasure = nextMeasure;
			currentTime.currentBeat = 0;
			currentTime.currentDivision = 0;
			return currentTime;
		}
		return 'new_measure';
	}

	getNextInLine(length, index, increment) {
		if (index === null) {
			return 0;
		}
		increment = increment || 1;
		let nextIndex = (Number(index) + Number(increment));
		if (nextIndex < length) {
			return nextIndex
		}
		return 'next';
	}

	// getNextInLine(arrayOfIds, currentId, increment) {
	// 	increment = increment || 1;
	// 	let index = arrayOfIds.indexOf(currentId);
	// 	if ((index + increment) <= arrayOfIds.length - 1) {
	// 		return arrayOfIds[index + increment];
	// 	}
	// 	return 'next';
	// }

	// playmode - get division based on currentTrackDivision
	// getDivision() {
	// 	let { layer, measures, beats, divisions } = this.props;
	// 	let { currentTrackDivision } = this.props.playback;
	// 	let { measureIndex, beatIndex, divIndex } = this.getMeasureIndex(currentTrackDivision, layer.measure_ids.length);
	// 	let measureId = layer.measure_ids[measureIndex];
	// 	let beatId = measures[measureId].beat_ids[beatIndex];
	// 	let divId = beats[beatId].division_ids[divIndex];
	// 	return divisions[divId];
	// }
	getDefaultTime(type) {
		return <div className={type}>
				<label>{type}</label>
				<select value={this.state[type]}
					onChange={(e)=>{ this.setState({ [type]: e.target.value }); }}>
					{type === 'defaultInterval' ? <option value='0n'>'0n'</option>: <option value='32n'>'32n'</option>}
					<option value='16n'>'16n'</option>
					<option value='8n'>'8n'</option>
					<option value='4n'>'4n'</option>
					<option value='2n'>'2n'</option>
					<option value='1n'>'1n'</option>
				</select>
			</div>
	}
	// getMeasureIndex(divIndex, numMeasures) {
	// 	// let beatsPerMeasure = 4;
	// 	let ppb = 4; // pulse per beat
	// 	let ppm = 16; // pulse per measure, aka div per measures
	// 	for (let i = 0; i < numMeasures; i++) {
	// 		let min = i * ppm; //inclusive
	// 		let max = ((i+1) * ppm) - 1; //inclusive
	// 		if (divIndex >= min && divIndex <= max) {
	// 			let numBeats = 4; // 4 beats per measure
	// 			for (let k = 0; k < numBeats; k++) {
	// 				let minBeat = (k * ppb) + min;
	// 				let maxBeat = (((k+1) * ppb) - 1) + min;
	// 				if (divIndex >= minBeat && divIndex <= maxBeat) {
	// 					return {
	// 						measureIndex: i,
	// 						beatIndex: k,
	// 						divIndex: divIndex - minBeat
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }
	
	getInstrument() {
		let { layer } = this.props;
		switch(layer.instrument) {
			case 'piano': return <Piano playNote={this.playNote}/>;
			case 'drum': return <Drums playNote={this.playNote} notes={layer.notes}/>;
			case 'singleClap': return <Drums playNote={this.playNote} notes={['hit']}/>;
			case 'player': return <Source playNote={this.playNote} player={layer.player}/>;
			default: return null
		}
	}

	render() {
		let { layer } = this.props;
		return (
			<div className='PlayMode'>
				<div className="PlayModeDetails">
					{this.getDefaultTime('defaultDuration')}
					{this.getDefaultTime('defaultInterval')}
					<span onClick={this.selectNextInterval}>skip</span>
				</div>
				{this.getInstrument()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		playback: state.track.playback,
		currentSelection: state.track.currentSelection,
		layers: state.track.layers,
		details: state.track.details
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addNote, editNote, updateSelection, addMeasure, editLayerDetail
	}, dispatch)
}

const ConnectedPlayMode = connect(mapStateToProps, mapDispatchToProps)(PlayMode)

export default ConnectedPlayMode