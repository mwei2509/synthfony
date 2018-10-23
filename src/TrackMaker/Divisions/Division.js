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
		let { division, playback } = this.props;
		if (division.div_index === playback.currentTrackDivision) {
			return true;
		}
		return false;
	}

	toggleSelect(e) {
		e.stopPropagation();
		let { updateSelection, currentSelection, division } = this.props;
		if (currentSelection.currentDivision === division.id) {
			updateSelection({
				currentLayer: division.layer_id,
				currentMeasure: division.measure_id,
				currentBeat: division.beat_id,
				currentDivision: null,
				currentNote: null
			})
		} else {
			updateSelection({
				currentLayer: division.layer_id,
				currentMeasure: division.measure_id,
				currentBeat: division.beat_id,
				currentDivision: division.id,
				currentNote: null
			})
		}
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
				onClick={this.toggleSelect}
				data-division={division.id}>
				
				{this.showNotes()}
			</div>
		);
		// <CreateNote divisionId={division.id}/>
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
		updateSelection
	}, dispatch)
}

const ConnectedDivision = connect(mapStateToProps, mapDispatchToProps)(Division)

export default ConnectedDivision