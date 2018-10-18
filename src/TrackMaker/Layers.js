import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Layer from './Layer';
import { addLayer, addMeasure } from './actions'
import './style.css'

class Layers extends Component {
	initLayer() {
		let { addLayer, addMeasure } = this.props;
		addLayer({})
		
		window.setTimeout(() => {
			let { currentLayer } = this.props;
			addMeasure(null, currentLayer);
		})
	}

	getLayers() {
		let { layers, currentLayer, layer_ids } = this.props; 
		if (layer_ids.length > 0) {
			return layer_ids.map((layer_id, index) => {
				let layer = layers[layer_id];
				let selected = layer_id === currentLayer;
				return <Layer
					layer_id={layer_id}
					key={index}
					selected={selected} />
			});
		} else {
			return <div className="layer-intro">
				<h1 onClick={this.initLayer.bind(this)}>Click to add a layer (or click the + in the sidebar)</h1>
				</div>
		}
	}

	render() {
		// {this.getSelectedLayer()}
		//{this.getPlaymode()}
		return (
			<div className='Layers'>
				{this.getLayers()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		currentLayer: state.track.currentSelection.currentLayer,
		layer_ids: state.track.details.layer_ids,
		layers: state.track.layers
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addLayer, addMeasure
	}, dispatch)
}

const ConnectedLayers = connect(mapStateToProps, mapDispatchToProps)(Layers)

export default ConnectedLayers