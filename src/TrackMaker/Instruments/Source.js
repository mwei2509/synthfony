import React, { Component } from 'react';
import './style.css'

export default class Source extends Component {
	constructor() {
		super()
		this.state = {
			offset: 0
		}
	}
	render() {
		let { player, playNote } = this.props;
		debugger;
		player.player.start(undefined, '8n');
		return (
			<div className='Source'>
			</div>
		);
	}
}
