import React, { Component } from 'react';
import Measure from './Measure';
import './style.css';

export default class Measures extends Component {
	getMeasures() {
		let { measureIds} = this.props;

		return measureIds.map((measureId, index) => {
			return <Measure measureId={measureId} key={index} />
		});
	}

	render() {
		return (
			<div className='Measures'>
				{this.getMeasures()}
			</div>
		);
	}
}