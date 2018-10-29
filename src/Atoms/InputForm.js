import React, { Component } from 'react';

export default class InputForm extends Component {
	constructor() {
		super();
	}
	handleChange(field, e) {
		let { onChange } = this.props;
		onChange(field, e.target.value);
	}
	render() {
		let { fields } = this.props;
		return fields.map((field) => {
			if (field.type === 'input') {
				return <div>
					<label>{field.name}</label>
					<input 
						value={field.value} 
						onChange={this.handleChange.bind(this, field.name)}
						/>
					</div>
			}
		})
	}
}