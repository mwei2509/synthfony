import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EditLayer from './EditLayer/index.js';
import AudioVisualization from '../AudioVisualization/index'
import Measures from './Measures';

class Layer extends Component {
	getStyle() {
		let { layer } = this.props;
		let numMeasures = layer.measure_ids.length;
		return {minWidth: `${numMeasures*505}px`};
	}
	getClasses() {
		let { layer, selected } = this.props;
		return 'Layer ' + 
			(layer.ready ? 'ready ':'not-ready ') + 
			(selected ? 'selected':'not-selected');
	}
	getIfSelected() {
		let { layer, selected } = this.props;
		if (selected) {
			return <EditLayer layer={layer} />
		} else {
			return null;
		}
	}

	render() {
		let { layer } = this.props;
		return (
			<div className={this.getClasses()} 
				style={this.getStyle()}>
				<Measures measureIds={layer.measure_ids} />
				<AudioVisualization layer={layer}/>
				<EditLayer layerId={layer.id} />
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return ({
		layer: state.track.layers[ownProps.layer_id],
		currentSelection: state.track.currentSelection
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
	}, dispatch)
}

const ConnectedLayer = connect(mapStateToProps, mapDispatchToProps)(Layer)

export default ConnectedLayer