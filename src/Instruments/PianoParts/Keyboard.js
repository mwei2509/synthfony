import React, { Component } from 'react';
import Key from './Key';

export default class Keyboard extends Component {
	generateKeys() {
		var numKeys = 88;
		var keyBoard = [];
		var inOctave = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
		var currentOctave = 0;
		var octaveIndex = 9; // note within octave
		
		var blackKeys = ['C#','D#','F#','G#','A#'];
		for (let i = 0; i < numKeys; i++) {
			if (octaveIndex >= inOctave.length) {
				octaveIndex = 0;
				currentOctave ++;
			}
			var key = inOctave[octaveIndex];
			keyBoard.push({
				note: key + currentOctave,
				color: blackKeys.includes(key) ? 'black':'white'
			});
			octaveIndex ++;
		}
		return keyBoard;
	}

	render() {
		var keyboard = this.generateKeys();
		let {
			playKey,
			releaseKey,
			small
		} = this.props;
		return (
			<div className={`keyboard ${small ? 'small':''}`}>
				{keyboard.map((key, index)=>{
					return <Key 
						key={index}
						info={key} 
						onMouseDown={playKey}
						onMouseUp={releaseKey}
						/>
					})}
			</div>
		)
	}
}