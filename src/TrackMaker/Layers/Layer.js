import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EditLayer from './EditLayer/index.js';
import AudioVisualization from '../../AudioVisualization/index'
import Measures from '../Measures/Measures';

class Layer extends Component {
	getStyle() {
		let { layer } = this.props;
		let numMeasures = layer.numMeasures;
		return {minWidth: `${numMeasures*80}px`};
	}
	getClasses() {
		let { layer, selected } = this.props;
		return 'Layer ' + 
			(layer.ready ? 'ready ':'not-ready ') + 
			(selected ? 'selected':'not-selected');
	}

	render() {
		let { layer } = this.props;
		// <AudioVisualization layer={layer}/>
		return (
			<div className={this.getClasses()} 
				style={this.getStyle()}>
				<Measures layer={layer} />
				<EditLayer layerId={layer.id} />
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let selected = ownProps.layer_id === state.track.currentSelection.currentLayer;
	return ({
		layer: state.track.layers[ownProps.layer_id],
		selected: selected
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
	}, dispatch)
}

const ConnectedLayer = connect(mapStateToProps, mapDispatchToProps)(Layer)

export default ConnectedLayer