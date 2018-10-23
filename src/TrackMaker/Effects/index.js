import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateEffect from './CreateEffect'
import Effects from './Effects'

export default class ShowEffects extends Component {
	constructor() {
		super();
	}

	render() {
		let { layer } = this.props;
		return (
			<div className='Effects'>
				<CreateEffect />
				<Effects inLayer={layer}/>
			</div>
		);
	}
}