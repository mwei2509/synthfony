import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setStopStatus, updateIndices, updateTrackPlay } from './actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SynthFony } from '../../utils/variables';
import { masterLayer } from '../PlayersAndEffects/Load'
import AudioVisualization from '../../AudioVisualization/index'
import Tone from 'tone'
import ShowMeter from './ShowMeter'
import './style.css';

class Master extends Component {
	constructor() {
		super();
		this.state = {
			// ready: false,
			progress: 0,
			waveform: {},
			meter: {},
			maxMeter: 0
		};
		// sets up splits
		this.splits = Array(100).join('|').split('|').reduce((acc, cur) => {
			let lastNum = acc[acc.length - 1];
			let newNum = (lastNum + 0.01).toFixed(2);
			acc.push(Number(newNum));
			return acc;
		}, [0.00]);
		// this.compileMaster = this.compileMaster.bind(this)
		this.playTrack = this.playTrack.bind(this)
		this.pauseTrack = this.pauseTrack.bind(this)
	}
	componentDidMount() {
		// debugger;
		// this.setState(this.props.trackPlay);
	}
	componentDidUpdate(prevProps) {
		if (prevProps.lastUpdate !== this.props.lastUpdate) {
			// this.setState({ ready: false })
			// window.setTimeout(this.compileMaster)
			if (this.state.playing) {
				// restart
				this.pauseTrack();
				// this.playTrack();
			}
		}
		if (prevProps.trackPlay.maxMeter === 0 && prevProps.trackPlay.maxMeter !== this.props.trackPlay.maxMeter) {
			this.setState(this.props.trackPlay);
		}
	}
	// compileMaster() {
	// 	let { layer_ids, layers } = this.props;
	// }
	getLayerIdWithMaxMeasures() {
		let { layer_ids, layers } = this.props;
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
		let { bpm } = this.props.details;
		let { layer_ids, layers } = this.props;
		let { maxMeasures, maxLayerId } = this.getLayerIdWithMaxMeasures();
		console.log(maxMeasures);
		if (layer_ids.length > 0) {			
			layer_ids.forEach((layer_id) => {
				let layer = layers[layer_id];
				layer.player.part.loop = true;
				layer.player.part.loopStart = 0;
				layer.player.part.loopEnd = `${maxMeasures}m`;
				layer.player.part.start(0);
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
		let { layer_ids, layers, updateTrackPlay } = this.props;
		if (layer_ids.length > 0) {			
			layer_ids.forEach((layer_id) => {
				let layer = layers[layer_id];
				layer.player.part.stop()
			})
		}
		Tone.Transport.stop();
		this.setState({
			playing: false
		})
		updateTrackPlay(this.state);
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
					progress: progress,
					meter: {
						...this.state.meter,
						[progress]: Tone.dbToGain(masterLayer.meter.getLevel())	
					},
					maxMeter: maxMeter
				})
				window.trackPlay = this.state;
			}
		}, 20);
	}
	showWave() {
		let {progress, meter, maxMeter} = this.state;
		return this.splits.map((prog) => {
			let color = prog == progress ? '#ff0000': '#000';
			// let height = meter[prog] * 20;
			let height = (((meter[prog])/maxMeter) * 100) -1;
			return <div style={{width: '4px', display: 'inline-block', height: `${height}px`, marginRight: '2px',
				backgroundColor: color}}>
			</div>
		})
	}
	getPlaybackControls() {
		let { playing } = this.state;
		if (playing) {
			return <button onClick={this.pauseTrack}>p a u s e</button>
		}
		return <button onClick={this.playTrack}>P L A Y</button>
	}
	/**
	 * This is the "master layer" with all of the waveforms that we "play" off of
	 */
	render() {
		return (
			<div className='Master'>
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

const mapStateToProps = (state) => {
	return ({
		trackPlay: state.track.playback.trackPlay,
		details: state.track.details,
		lastUpdate: state.track.details.lastUpdate,
		layer_ids: state.track.details.layer_ids,
		layers: state.track.layers
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		updateTrackPlay
	}, dispatch)
}

const ConnectedMaster = connect(mapStateToProps, mapDispatchToProps)(Master)

export default ConnectedMaster