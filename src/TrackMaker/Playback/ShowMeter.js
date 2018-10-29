import React, { Component } from 'react';
import './style.css';

export default class ShowMeter extends Component {
	constructor() {
		super();
		// sets up splits
		this.splits = Array(100).join('|').split('|').reduce((acc, cur) => {
			let lastNum = acc[acc.length - 1];
			let newNum = (lastNum + 0.01).toFixed(2);
			acc.push(Number(newNum));
			return acc;
		}, [0.00]);
	}

	showWave() {
		let {progress, meter, maxMeter} = this.props;
		return this.splits.map((prog) => {
			let color = prog == progress ? '#ff0000': '#000';
			// let height = meter[prog] * 20;
			let height = (((meter[prog])/maxMeter) * 100) -1;
			return <div style={{width: '4px', display: 'inline-block', height: `${height}px`, marginRight: '2px',
				backgroundColor: color}}>
			</div>
		})
	}

	/**
	 * This is the "master layer" with all of the waveforms that we "play" off of
	 */
	render() {
		return (
			<div className='ShowMeter' style={{height: '100px'}}>
				{this.showWave()}
			</div>
		);
	}
}