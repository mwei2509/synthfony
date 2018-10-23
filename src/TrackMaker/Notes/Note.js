import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateSelection } from '../actions'
import EditNote from './EditNote'
import Draggable from 'react-draggable'
import './style.css'

class Note extends Component {
	constructor() {
		super();
		this.handleStop = this.handleStop.bind(this);
	}
	isSelected() {
		let { note } = this.props;
		let { currentNote } = this.props.currentSelection;
		return note.id === currentNote;
	}
	handleClick(e) {
		e.stopPropagation();
		let { note, updateSelection } = this.props;
		let selected = this.isSelected();
		updateSelection({
			currentLayer: note.layer_id,
			currentMeasure: note.measure_id,
			currentBeat: note.beat_id,
			currentDivision: note.division_id,
			currentNote: note.id
		})
	}
	getEditNote() {
		let selected = this.isSelected()
		let { note } = this.props;
		if (selected) {
			return <EditNote note={note} />
		}
	}
	getDurationClass() {
		let { duration } = this.props.note;
		switch(duration) {
			case '32n': return 'thirty-second-note';
			case '16n': return 'sixteenth-note';
			case '8n': return 'eighth-note';
			case '4n': return 'quarter-note';
			case '2n': return 'half-note';
			case '1n': return 'whole-note';
		}
	}
	getOffset() {
		let { index } = this.props;
		let height = 13;
		// figure out offset
		let offset = 0;
		return offset + (index * 13);
	}
	handleStop(e) {
		// debugger;
	}
	render() {
		let { note, index, updateSelection } = this.props;
		let selected = this.isSelected()
		let classes = `Note handle ${selected?'selected ':''} ${this.getDurationClass()}`;
		let style = {
			top: this.getOffset() + 'px'
		};
		return (
			<Draggable
				grid={[20,100]}
				onStop={this.handleStop}>
				<div className={classes} 
					style={style}
					onClick={this.handleClick.bind(this)}>
					{note.note}
					{this.getEditNote()}
				</div>
			</Draggable>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return ({
		currentSelection: state.track.currentSelection,
		note: state.track.notes[ownProps.noteId]
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		updateSelection
	}, dispatch)
}

const ConnectedNote = connect(mapStateToProps, mapDispatchToProps)(Note)

export default ConnectedNote