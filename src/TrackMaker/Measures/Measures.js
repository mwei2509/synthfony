import React, { Component } from 'react';
import Measure from './Measure';
import { makeArrayWithIndex } from '../../utils/functions'
import './style.css';

export default class Measures extends Component {
	getMeasures() {
		let { layer } = this.props;
		return makeArrayWithIndex(layer.numMeasures).map((index) => {
			return <Measure 
				layerId={layer.id}
				measureIndex={index} />
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