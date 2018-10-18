import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { editLayerType, editLayerReady, deactivateLayer } from '../actions';
import CreateMeasure from '../CreateMeasure';
import PlayMode from './PlayMode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'

class Options extends Component {
	constructor() {
		super()
	}
	render() {
		let { type, editLayer } = this.props;
		return <select value={type} onChange={(e)=>{editLayer(e.target.value)}}>
			<option value="bass">Bass</option>
			<option value="synth">Synth</option>
			<option value="piano">Piano</option>
			<option value="kick">Kick</option>
			<option value="clap">Clap</option>
			<option value="hihat">Hihat</option>
			<option value="snare">Snare</option>
			<option value="tom">Tom</option>
			<option value="membrane">Membrane</option>
		</select>
	}
}

class EditLayer extends Component {
	constructor() {
		super();
		this.playerReady = this.playerReady.bind(this)
		this.editLayerInstrument = this.editLayerInstrument.bind(this)
	}
	playerReady(layerId) {
		let { editLayerReady } = this.props;
		editLayerReady(layerId, true);
	}

	editLayerInstrument(value) {
		let { layer } = this.props;
		let { editLayerType } = this.props;
		editLayerType(layer.id, value, this.playerReady);
	}
	render() {
		let { selected, layer, track } = this.props;
		let { deactivateLayer } = this.props;
		if (!selected) {
			return null;
		}
		return (
			<div className='EditLayer'>
				<div>
					<Options type={layer.type} editLayer={this.editLayerInstrument} />
					<CreateMeasure layer={layer} />
					<span className="icon" onClick={deactivateLayer.bind(this, layer.id)}><FontAwesomeIcon icon="trash" /></span>
				</div>
				<PlayMode layer={layer} />
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	return ({
		layer: state.track.layers[ownProps.layerId],
		selected: state.track.currentSelection.currentLayer === ownProps.layerId,
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		editLayerType, editLayerReady, deactivateLayer
	}, dispatch)
}

const ConnectedEditLayer = connect(mapStateToProps, mapDispatchToProps)(EditLayer)

export default ConnectedEditLayer