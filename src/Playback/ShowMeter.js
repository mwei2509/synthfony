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
			let played = prog == progress;
			let height = (((meter[prog])/maxMeter) * 100) -1;
			return <div 
				className={`meter-bars ${played ? 'meter_played':''}`}
				style={{ 
					height: `${height}px`
				}}>
			</div>
		})
	}

	/**
	 * This is the "master layer" with all of the waveforms that we "play" off of
	 */
	render() {
		return (
			<div className='ShowMeter'>
				{this.showWave()}
			</div>
		);
	}
}