import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addMeasure } from './actions';

class CreateMeasure extends Component {
	constructor() {
		super();
		this.addMeasure = this.addMeasure.bind(this);
	}

	addMeasure() {
		let { addMeasure } = this.props;
		let { layer } = this.props;

		addMeasure(layer);
	}

	render() {
		return (
			<div className='CreateMeasure'>
				<button onClick={this.addMeasure.bind(this)}>Add Measure</button>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addMeasure
	}, dispatch)
}

const ConnectedCreateMeasure = connect(mapStateToProps, mapDispatchToProps)(CreateMeasure)

export default ConnectedCreateMeasure