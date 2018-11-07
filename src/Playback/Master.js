import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateIndices, updateTrackPlay } from './actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SynthFony } from '../utils/variables';
import { isUndefined } from '../utils/functions';
import { masterLayer } from '../TrackMaker/PlayersAndEffects/Load'
import PlaybackControls from './PlaybackControls'
import AudioVisualization from '../AudioVisualization/index'
import Tone from 'tone'
import ShowMeter from './ShowMeter'
import './style.css';

class Master extends Component {
	constructor(props) {
		super(props);
		this.state = this.props.trackPlay;
		this.state.playing = false;
		
		// sets up splits
		this.splits = PlaybackControls.makeMeterSplits();
		this.playTrack = this.playTrack.bind(this)
		this.pauseTrack = this.pauseTrack.bind(this)
		this.stopTrack = this.stopTrack.bind(this)
		this.startedPlaying = this.startedPlaying.bind(this)
		this.stoppedPlaying = this.stoppedPlaying.bind(this)
		this.updateProgressInterval = this.updateProgressInterval.bind(this)
	}

	componentDidMount() {
		if (this.props.playing && !this.state.playing) {
			this.playTrack();
		}
	}

	componentWillUnmount() {
		this.stopTrack();
	}

	componentDidUpdate(prevProps) {
		let shouldPlay = this.props.playing
		if (this.state.playing) {
			let trackChanged = prevProps.details.lastUpdate !== this.props.details.lastUpdate;
			if (!shouldPlay || trackChanged) {
				return this.pauseTrack();
			}
		} else {
			if (shouldPlay) {
				return this.playTrack();
			}
		}
	}

	// shouldComponentUpdate(nextProps) {
	// 	let trackUpdated = this.props.details.lastUpdate !== nextProps.details.lastUpdate;
	// 	let playChanged = this.props.playing !== nextProps.playing;
	// 	return trackUpdated || playChanged;
	// }

	playTrack() {
		PlaybackControls.setParams({
			bpm: this.props.details.bpm,
			layer_ids: this.props.details.layer_ids,
			layers: this.props.layers
		});
		PlaybackControls.playTrack({
			onSuccess: this.startedPlaying
		});
	}

	startedPlaying() {
		this.setProgressInterval();
		this.setState({
			playing: true
		})
	}
	stoppedPlaying() {
		this.props.updateTrackPlay(this.state)
		this.setState({
			playing: false
		})
	}
	pauseTrack() {
		clearInterval(this.progressInterval);
		PlaybackControls.pauseTrack(this.stoppedPlaying);
	}
	stopTrack() {
		clearInterval(this.progressInterval);
		PlaybackControls.stopTrack();
	}
	setProgressInterval() {
		clearInterval(this.progressInterval);
		this.progressInterval = window.setInterval(this.updateProgressInterval, 20);
	}
	updateProgressInterval() {
		let progress = PlaybackControls.getProgress();
		if (this.state.progress != progress) {	
			if (this.props.isPreview) {
				this.setNewProgress(progress);
			} else {
				let newMeter = PlaybackControls.getMasterMeter();
				this.setNewProgressAndMeter(progress, newMeter);
			}
		}
	}
	setNewProgress(progress) {
		this.setState({
			progress: progress
		})
	}
	setNewProgressAndMeter(progress, newMeter) {
		let maxMeter = this.state.maxMeter < newMeter ? newMeter : this.state.maxMeter;
		this.setState({
			progress: progress,
			meter: {
				...this.state.meter,
				[progress]: newMeter
			},
			maxMeter: maxMeter
		})
	}
	showWave() {
		let {progress, meter, maxMeter} = this.state;
		return this.splits.map((prog) => {
			let color = prog == progress ? '#ff0000': '#000';
			// let height = meter[prog] * 20;
			let height = (((meter[prog])/maxMeter) * 100) -1;
			return <div className="meter-bars" style={{width: '4px', display: 'inline-block', height: `${height}px`, marginRight: '2px',
				backgroundColor: color}}>
			</div>
		})
	}
	getPlaybackControls() {
		let { playing } = this.state;
		let { isPreview } = this.props;
		if (isPreview) return null;
		if (playing) {
			return <button onClick={this.pauseTrack}>p a u s e</button>
		}
		return <button onClick={this.playTrack}>P L A Y</button>
	}
	/**
	 * This is the "master layer" with all of the waveforms that we "play" off of
	 */
	render() {
		let { isPreview } = this.props;
		if (this.props.playing) {
			return (
				<div className={`Master ${ isPreview ? 'master_preview':''}`}>
					<ShowMeter
						progress={this.state.progress}
						meter={this.state.meter}
						maxMeter={this.state.maxMeter}
						/>
				</div>
			);
		}
		return null;
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		playing: ownProps.playing || state.track.playback.playing,
		trackPlay: ownProps.trackPlay || state.track.playback.trackPlay,
		details: ownProps.details || state.track.details,
		layers: ownProps.layers || state.track.layers
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		updateTrackPlay
	}, dispatch)
}

const ConnectedMaster = connect(mapStateToProps, mapDispatchToProps)(Master)

export default ConnectedMaster