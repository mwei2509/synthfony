import Tone from 'tone'
import { masterLayer } from '../TrackMaker/PlayersAndEffects/Load'

let defaultPlaybackControls = {
	playTrack: {
		onSuccess: function() {
			console.log('playing')
		}
	}
}
const PlaybackControls = {
	setParams: function (params){
		this.params = params;
		this.params.maxMeasures = this.getMaxMeasures();
	},
	makeMeterSplits: () => {
		return Array(100).join('|').split('|').reduce((acc, cur) => {
			let lastNum = acc[acc.length - 1];
			let newNum = (lastNum + 0.01).toFixed(2);
			acc.push(Number(newNum));
			return acc;
		}, [0.00]);
	},
	getMaxMeasures: function (){		
		let { layer_ids, layers } = this.params;
		return layer_ids.reduce((acc, layer_id) => {
			let layer = layers[layer_id];
			let numMeasures = layer.numMeasures;
			if (acc < numMeasures) {
				return numMeasures
			}
			return acc;
		}, 0);
	},
	playTrack: function (settings = defaultPlaybackControls.playTrack){
		let { onSuccess } = settings;
		let { layer_ids, layers, bpm, maxMeasures } = this.params;
		if (layer_ids.length > 0) {
			layer_ids.forEach((layer_id) => {
				let layer = layers[layer_id];
				layer.player.part.start(0);
			})
			Tone.Transport.bpm.value = bpm;
			Tone.Transport.loop = true;
			Tone.Transport.loopStart = 0;
			Tone.Transport.loopEnd = `${maxMeasures}m`;
			Tone.Transport.start();
			onSuccess();
		}
	},
	pauseTrack: function(callback) {
		Tone.Transport.pause();
		callback();
	},
	stopTrack: function() {
		if (this.params) {			
			let { layer_ids, layers } = this.params;
			if (layer_ids.length > 0) {			
				layer_ids.forEach((layer_id) => {
					let layer = layers[layer_id];
					layer.player.part.stop()
				})
			}
			Tone.Transport.stop();
		}
	},
	getProgress: function() {
		let prog = Tone.Transport.progress;
		return Number(Math.max(Math.round(prog*100)/100).toFixed(2));
	},
	getMasterMeter: function() {
		return Tone.dbToGain(masterLayer.meter.getLevel());
	}
}

export default PlaybackControls;