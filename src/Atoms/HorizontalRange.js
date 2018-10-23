import React, { Component } from 'react';
import './style.css'

export default class HorizontalRange extends Component {
	constructor() {
		super()
		this.handleChange = this.handleChange.bind(this)
	}
	
	handleChange(e) {
		let { action } = this.props;
		action(e.target.value);
	}

	getMin() {
		let { min } = this.props;
		return typeof min !== 'undefined' ? min : "0";
	}
	getMax() {
		let { max } = this.props;
		return typeof max !== 'undefined' ? max : "100";
	}
	getStep() {
		let { step } = this.props;
		return typeof step !== 'undefined' ? step : '1';
	}
	getLabel() {
		let { label } = this.props;
		return label.split('.').map((part) => {
			return <p>{part}</p>
		})
	}
	render() {
		let { label, value } = this.props;
		return (
			<div className='HorizontalRange'>
				<input type="range"
					value={value}
					onChange={this.handleChange}
					min={this.getMin()}
					max={this.getMax()}
					step={this.getStep()}/>
				<label>{this.getLabel()}<br />{value}</label>
			</div>
		);
	}
}