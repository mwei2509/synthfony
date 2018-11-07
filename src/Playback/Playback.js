import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { masterLayer } from '../TrackMaker/PlayersAndEffects/Load'
import Tone from 'tone'
import ShowMeter from './ShowMeter'
import './style.css';

export default class Playback extends Component {
	constructor(props) {
		super(props);
		this.state = this.props.trackPlay;
		// sets up splits
		this.splits = Array(100).join('|').split('|').reduce((acc, cur) => {
			let lastNum = acc[acc.length - 1];
			let newNum = (lastNum + 0.01).toFixed(2);
			acc.push(Number(newNum));
			return acc;
		}, [0.00]);
		// this.compilePlayback = this.compilePlayback.bind(this)
		this.playTrack = this.playTrack.bind(this)
		this.pauseTrack = this.pauseTrack.bind(this)
	}
	componentDidMount() {
		// this.setState(this.props.trackPlay);
		if (this.state.playing) {
			this.playTrack();
		}
	}
	componentWillUnmount() {
		this.pauseTrack();
	}
	getLayerIdWithMaxMeasures() {
		let { layers, layer_ids } = this.props
		return layer_ids.reduce((acc, layer_id) => {
			let layer = layers[layer_id];
			let numMeasures = layer.numMeasures;
			if (acc.maxMeasures < numMeasures) {
				return {
					maxMeasures: numMeasures,
					maxLayerId: layer_id
				}
			}
			return acc;
		}, { maxMeasures: 0, maxLayerId: null});
	}
	playTrack() {
		let { bpm, layer_ids, layers } = this.props
		let { maxMeasures, maxLayerId } = this.getLayerIdWithMaxMeasures();
		if (layer_ids.length > 0) {
			layer_ids.forEach((layer_id) => {
				let layer = layers[layer_id];
				layer.player.part.loop = true;
				// layer.player.part.loopStart = 0;
				// layer.player.part.loopEnd = `${maxMeasures}m`;
				layer.player.part.start();
			})
			this.setProgressInterval(maxLayerId);
			Tone.Transport.bpm.value = bpm;
			Tone.Transport.start();
			this.setState({
				playing: true
			})
		}
	}
	pauseTrack() {
		clearInterval(this.progressInterval);
		let { layers, layer_ids } = this.props;
		if (layer_ids.length > 0) {			
			layer_ids.forEach((layer_id) => {
				let layer = layers[layer_id];
				layer.player.part.stop()
			})
		}
		Tone.Transport.stop();
		this.setState({
			playing: false
		});
	}
	setProgressInterval(layer_id) {
		clearInterval(this.progressInterval);
		let { layers } = this.props;
		this.progressInterval = window.setInterval(()=>{
			let num = layers[layer_id].player.part.progress;
			let progress = Number(Math.max(Math.round(num*100)/100).toFixed(2));
			if (this.state.progress != progress) {	
				let newMeter = Tone.dbToGain(masterLayer.meter.getLevel());
				let maxMeter = this.state.maxMeter < newMeter ? newMeter : this.state.maxMeter;
				this.setState({
					progress: progress
				})
			}
		}, 20);
	}
	getPlaybackControls() {
		let { playing } = this.state;
		let { hideControls } = this.props;
		if (hideControls) return null;
		if (playing) {
			return <button onClick={this.pauseTrack}>p a u s e</button>
		}
		return <button onClick={this.playTrack}>P L A Y</button>
	}
	render() {
		return (
			<div className='Playback'>
				<ShowMeter
					progress={this.state.progress}
					meter={this.state.meter}
					maxMeter={this.state.maxMeter}
				/>
				{this.getPlaybackControls()}
			</div>
		);
	}
}