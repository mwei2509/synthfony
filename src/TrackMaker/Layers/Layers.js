import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Layer from './Layer';
import { masterLayer } from '../PlayersAndEffects/Load'
import AudioVisualization from '../../AudioVisualization/index'
import CreateLayer from './CreateLayer'
import './style.css'

class Layers extends Component {
	getLayers() {
		let { layer_ids } = this.props; 
		if (layer_ids.length > 0) {
			return layer_ids.map((layer_id, index) => {
				return <Layer
					layer_id={layer_id}
					key={index} />
			});
		} else {
			return <CreateLayer isIntro={true} />
		}
	}

	render() {
		// <AudioVisualization 
		// 	layer={{player: masterLayer}}
		// 	size="large"/>
		return (
			<div className='Layers'>
				{this.getLayers()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		layer_ids: state.track.details.layer_ids
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
	}, dispatch)
}

const ConnectedLayers = connect(mapStateToProps, mapDispatchToProps)(Layers)

export default ConnectedLayers