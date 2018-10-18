import React, { Component } from 'react';
import './style.css';

export default class Key extends Component {
	render() {
		var playKey = this.props.onMouseDown;
		var releaseKey = this.props.onMouseUp;
		var {note, color} = this.props.info;
		return (
			<div className={"key " + color} 
				onMouseDown={(e)=>{ e.stopPropagation(); playKey(note);}}
				onMouseUp={(e)=>{ e.stopPropagation(); releaseKey(note);}}
				><span>{note}</span></div>
		)
	}
}