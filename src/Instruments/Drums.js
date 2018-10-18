import React, { Component } from 'react';
import './style.css'

export default class Drums extends Component {
	getDrumCircles() {
		let {layer, playNote} = this.props;
		return layer.noteOptions.map((note) => {
			return <div className='drum-hits' onClick={playNote.bind(this, note)}>
					<span>{note}</span>
				</div>
		})
	}
	render() {
		return (
			<div className='Drums'>
				{this.getDrumCircles()}
			</div>
		);
	}
}
