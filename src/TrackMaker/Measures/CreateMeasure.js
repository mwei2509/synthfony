import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addMeasure } from './actions';

class CreateMeasure extends Component {
	constructor() {
		super();
	}

	render() {
		let { addMeasure, layer } = this.props;
		return (
			<div className='CreateMeasure'>
				<button onClick={addMeasure.bind(this, layer)}>Add Measure</button>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addMeasure
	}, dispatch)
}

const ConnectedCreateMeasure = connect(mapStateToProps, mapDispatchToProps)(CreateMeasure)

export default ConnectedCreateMeasure