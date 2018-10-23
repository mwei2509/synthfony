import React, { Component } from 'react';
import LoadingDiv from '../Atoms/Loading';
import Keyboard from './PianoParts/Keyboard'

export default class Piano extends Component {
	constructor() {
		super();
		this.state = {
			ready: false
		}
		this.playKey = this.playKey.bind(this);
		this.releaseKey = this.releaseKey.bind(this);
	}
	
	playKey(key) {
		let { playNote } = this.props;
		if (playNote) {
			playNote(key);
		}
	}

	releaseKey(key) {
		// this.piano.triggerRelease(key);
	}

	render() {
		if (this.state.ready) {
			return (
				<div className="Piano">
					<Keyboard 
						playKey={this.playKey}
						releaseKey={this.releaseKey}
						small={this.props.small} />
				</div>
			);
		} else {
			return (
				<div className="Piano">
					<Keyboard 
						playKey={this.playKey}
						releaseKey={this.releaseKey}
						small={this.props.small} />
				</div>
			);
			// return <LoadingDiv />
		}
	}
}
