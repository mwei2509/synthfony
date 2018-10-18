import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { deselectItem, editNote } from './actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class EditNote extends Component {
	constructor() {
		super()
		this.closeModal = this.closeModal.bind(this)
	}
	closeModal(e) {
		e.stopPropagation();
		let { deselectItem } = this.props;
		deselectItem({
			currentNote: null
		});
	}
	editDuration() {
		let { editNote, note } = this.props;
		let { duration } = this.props.note;
		return <select value={duration} onChange={(e)=>{ editNote(note.id, {duration: e.target.value}); }}>
			<option value="32n">"32n"</option>
			<option value="16n">"16n"</option>
			<option value="8n">"8n"</option>
			<option value="4n">"4n"</option>
			<option value="2n">"2n"</option>
			<option value="1n">"1n"</option>
		</select>
	}
	getNoteOptions() {
		let { layers, note } = this.props;
		return layers[note.layer_id].noteOptions.map(note => {
			return <option value={note}>{note}</option>
		})
	}
	editNoteOption() {
		let { editNote, note } = this.props;
		return <select value={note.note} onChange={(e)=>{ editNote(note.id, {note: e.target.value}); }}>
			{this.getNoteOptions()}
		</select>
	}
	render() {
		let { currentSelection } = this.props;
		return (
			<div className='EditNote'>
				<span className="icon" onClick={this.closeModal}><FontAwesomeIcon icon="times" /></span>
				{this.editDuration()}
				{this.editNoteOption()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		currentSelection: state.track.currentSelection,
		layers: state.track.layers
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		deselectItem, editNote
	}, dispatch)
}

const ConnectedEditNote = connect(mapStateToProps, mapDispatchToProps)(EditNote)

export default ConnectedEditNote