import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getRandomInt } from '../utils/functions';
import { addNote, updateSelection } from './actions';
import Note from './Note';

class Division extends Component {
	constructor() {
		super();
		this.addNote = this.addNote.bind(this);
		this.selectDivision = this.selectDivision.bind(this);
	}

	addNote(e) {
		e.stopPropagation();
		let { layer, division, addNote} = this.props;
		let { stop } = this.props.playback;
		let noteOptions = layer.noteOptions;
		let note = noteOptions[Math.ceil(noteOptions.length/2)];
		if (stop) {
			layer.trigger(layer, note, '16n');
		}
		addNote({
			note: note,
			duration: '16n'
		}, division);
	}

	isBeingPlayed() {
		let { division, playback } = this.props;
		if (division.div_index === playback.currentTrackDivision) {
			return true;
		}
		return false;
	}
	selectDivision(e) {
		e.stopPropagation();
		let { updateSelection, division } = this.props;
		updateSelection({
			currentLayer: division.layer_id,
			currentMeasure: division.measure_id,
			currentBeat: division.beat_id,
			currentDivision: division.id,
			currentNote: null
		})
		
	}
	
	isSelected() {
		let { division } = this.props;
		let { currentDivision } = this.props.currentSelection;
		return division.id === currentDivision;
	}
	showNotes() {
		let { division } = this.props;
		return division.note_ids.map((note_id, index) => {
			return <Note key={index} noteId={note_id} />
		});
	}
	render() {
		let { division, playback } = this.props;
		let selected = this.isSelected();
		let beingPlayed = this.isBeingPlayed();
		return (
			<div className={'Division ' + (beingPlayed ? 'being-played ':'') + (selected?'selected ':'')}
				onClick={this.selectDivision}
				data-division={division.id}>
				<span className="add-note" onClick={this.addNote}>+</span>
				{this.showNotes()}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let division = state.track.divisions[ownProps.divisionId];
	let layer = state.track.layers[division.layer_id];
	return ({
		division: division,
		layer: layer,
		currentSelection: state.track.currentSelection,
		playback: state.playback
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addNote, updateSelection
	}, dispatch)
}

const ConnectedDivision = connect(mapStateToProps, mapDispatchToProps)(Division)

export default ConnectedDivision