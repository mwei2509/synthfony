import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { editLayerDetail, editLayerType, editLayerReady, deactivateLayer } from '../actions';
import CreateMeasure from '../../Measures/CreateMeasure';
import LayerControls from './LayerControls';
import PlayMode from './PlayMode';
import ShowEffects from '../../Effects/index';
import ChangeInstrument from './ChangeInstrument';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'

class EditLayer extends Component {
	constructor() {
		super();
		this.state = {
			minify: null
		}
		this.toggleMinify = this.toggleMinify.bind(this);
	}
	toggleMinify() {
		this.setState({
			minify: !this.state.minify
		})
	}
	componentDidUpdate(prevProps, prevState) {
		let newOrChanged = typeof this.state.minify !== 'boolean' || prevProps.selected !== this.props.selected;
		if (newOrChanged && this.props.selected && this.props.divisionSelected) {
			this.setState({
				minify: false
			});
		}
	}
	getExpandedPlaymode() {
		let { layer, track } = this.props;
		let { deactivateLayer, editLayerDetail } = this.props;
		return (
			<div>
				<div className="EditLayerDetails">
					<ChangeInstrument layer={layer} />
					<CreateMeasure layer={layer} />
					<span className="icon" onClick={deactivateLayer.bind(this, layer.id)}><FontAwesomeIcon icon="trash" /></span>
				</div>
				<PlayMode layer={layer} />
				<LayerControls
					layer={layer}
					editLayerDetail={editLayerDetail}/>
				<ShowEffects layer={layer} />
			</div>
		)
	}
	render() {
		let { layer, selected } = this.props;
		if (!selected || !layer) {
			return null;
		}
		let minified = this.state.minify;
		return (
			<div className='EditLayer'>
				<span className="icon" onClick={this.toggleMinify}><FontAwesomeIcon icon="times" /></span>
				{minified === null || minified === true ? null : this.getExpandedPlaymode()}
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	return ({
		layer: state.track.layers[ownProps.layerId],
		divisionSelected: !!state.track.currentSelection.currentDivision,
		selected: state.track.currentSelection.currentLayer === ownProps.layerId,
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		deactivateLayer, editLayerDetail
	}, dispatch)
}

const ConnectedEditLayer = connect(mapStateToProps, mapDispatchToProps)(EditLayer)

export default ConnectedEditLayer