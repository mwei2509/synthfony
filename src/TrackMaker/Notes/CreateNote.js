import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addNote } from './actions';
import { updateSelection } from '../actions';
import Modal from '../../Atoms/Modal'
import Piano from '../Instruments/Piano';

class CreateNote extends Component {
	constructor() {
		super();
		this.modal = React.createRef();
		this.updateSelection = this.updateSelection.bind(this);
	}
	updateSelection() {
		// let { division, updateSelection } = this.props;
		// updateSelection({
		// 	currentLayer: division.layer_id,
		// 	currentMeasure: division.measure_id,
		// 	currentBeat: division.beat_id,
		// 	currentDivision: division.id,
		// 	currentNote: null,
		// 	currentEffect: null
		// })
	}
	render() {
		let { selected } = this.props;
		return (
			<div className='CreateNote'>
				<Modal 
					ref={this.modal} 
					button="+"
					onOpen={this.updateSelection}
					modalWrapperClassNames="create-note-modal-wrapper"
					innerModalClassNames="create-note-inner-modal"
					suppressModal={!selected}>
				 	<Piano small={true} />
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let selected = state.track.currentSelection.currentDivision === ownProps.divisionId;
	let division = state.track.divisions[ownProps.divisionId];
	let layer = state.track.layers[division.layer_id];
	return ({
		layer: layer,
		division: division,
		selected: selected
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addNote, updateSelection
	}, dispatch)
}

const ConnectedCreateNote = connect(mapStateToProps, mapDispatchToProps)(CreateNote)

export default ConnectedCreateNote