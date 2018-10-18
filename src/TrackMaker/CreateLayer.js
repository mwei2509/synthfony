import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addLayer, addMeasure } from './actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CreateLayer extends Component {
	constructor() {
		super();
		this.initLayer = this.initLayer.bind(this);
	}

	initLayer() {
		let { addLayer, addMeasure } = this.props;
		addLayer({})
		
		window.setTimeout(() => {
			let { currentLayer } = this.props.currentSelection;
			addMeasure(null, currentLayer);
		})
	}
	render() {
		return (
			<div className='CreateLayer'>
				<span className="icon" onClick={this.initLayer}><FontAwesomeIcon icon="plus" /></span>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		currentSelection: state.track.currentSelection
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addLayer, addMeasure
	}, dispatch)
}

const ConnectedCreateLayer = connect(mapStateToProps, mapDispatchToProps)(CreateLayer)

export default ConnectedCreateLayer