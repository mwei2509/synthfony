import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getRandomInt } from '../../utils/functions';
import { updateSelection } from '../actions';
import Note from '../Notes/Note';
import CreateNote from '../Notes/CreateNote'
import './style.css'

class Division extends Component {
	constructor() {
		super();
		this.toggleSelect = this.toggleSelect.bind(this);
	}

	isBeingPlayed() {
		// let { division, playback } = this.props;
		// do bars:beats:16
		// return false;
	}

	toggleSelect(e) {
		e.stopPropagation();
		let { updateSelection} = this.props;
		let { layerId, measureIndex, beatIndex, divisionIndex } = this.props;

		let sameNote = this.isSelected();
		if (sameNote) {
			// deselect
			updateSelection({
				currentLayer: layerId,
				currentMeasure: measureIndex,
				currentBeat: beatIndex,
				currentDivision: null,
				currentNote: null
			})
		} else {
			updateSelection({
				currentLayer: layerId,
				currentMeasure: measureIndex,
				currentBeat: beatIndex,
				currentDivision: divisionIndex,
				currentNote: null
			})
		}
	}

	isSelected() {
		let { layerId, measureIndex, beatIndex, divisionIndex } = this.props;
		let { currentLayer, currentMeasure, currentBeat, currentDivision } = this.props.currentSelection;
		return currentLayer === layerId && 
			currentMeasure === measureIndex &&
			currentBeat === beatIndex &&
			currentDivision === divisionIndex;
	}
	
	showNotes() {
		let { layer, measureIndex, beatIndex, divisionIndex } = this.props;
		let divisionTime = `${measureIndex}:${beatIndex}:${divisionIndex}`;
		return layer.noteParts.filter((note) => {
			return note.time === divisionTime;
		}).map((note, index) => {
			return <Note
				note={note}
				noteIndex={index} />
		});
	}
	render() {
		let selected = this.isSelected();
		let beingPlayed = this.isBeingPlayed();
		return (
			<div className={'Division ' + (beingPlayed ? 'being-played ':'') + (selected?'selected ':'')}
				onClick={this.toggleSelect}>
				
				{this.showNotes()}
			</div>
		);
		// <CreateNote divisionId={division.id}/>
	}
}

const mapStateToProps = (state, ownProps) => {
	return ({
		layer: state.track.layers[ownProps.layerId],
		currentSelection: state.track.currentSelection
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		updateSelection
	}, dispatch)
}

const ConnectedDivision = connect(mapStateToProps, mapDispatchToProps)(Division)

export default ConnectedDivision