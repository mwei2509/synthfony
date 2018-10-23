import React, { Component } from 'react';

export default class SelectOptions extends Component {
	constructor() {
		super()
	}
	getOptions() {
		let { options } = this.props;
		return options.map((option) => {
			return <option value={option.value}>{option.label}</option>
		});
	}
	render() {
		let { label, value, onSelect } = this.props;
		return (
			<div>
				{label}
				<select value={value} onChange={(e)=>{onSelect(e.target.value)}}>
					{this.getOptions()}
				</select>
			</div>
		)
	}
}