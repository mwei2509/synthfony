import Tone from 'tone';
import Player from './Player'
import { BASE_URL, AudioVis } from '../utils/variables';
import { isObject } from '../utils/functions'

export const getInstrument = (instrument, callback) => {
	let meter = new Tone.Meter();
	let settings = getSettings(instrument);
	let player = getPlayer(instrument, settings, callback, meter);
	let trigger = getTrigger(instrument);
	let notes = getNotes(instrument, player);
	let ready = !asyncInstrument(instrument);
	let isSampler = typeIsSampler(instrument);
	let alterPlayer = getAlter(instrument);

	return {
		player: player, // can be combo type
		trigger: trigger,
		notes: notes,
		ready: ready,
		isSampler: isSampler,
		alterPlayer: alterPlayer,
		settings: settings,
		meter: meter
	};
}

const typeIsSampler = (type) => {
	switch(type) {
		case "clap": return true;
		case "hihat": return true;
		case "tom": return true;
		case "snare": return true;
		default: return false;
	}
}

const asyncInstrument = (type) => {
	switch(type) {
		case "piano": return true;
		case "clap": return true;
		case "hihat": return true;
		case "tom": return true;
		// case "snare": return true;
		default: return false;
	}
}

const getNotes = (instrument, player) => {
	if (isObject(player._players)) {
		return Object.keys(player._players);
	}
	return generateKeys();
}

const generateKeys = () =>{
	let numKeys = 88;
	let keyBoard = [];
	let inOctave = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
	let currentOctave = 0;
	let octaveIndex = 9; // note within octave
	
	// let blackKeys = ['C#','D#','F#','G#','A#'];
	for (let i = 0; i < numKeys; i++) {
		if (octaveIndex >= inOctave.length) {
			octaveIndex = 0;
			currentOctave ++;
		}
		let key = inOctave[octaveIndex];
		keyBoard.push(key + currentOctave);
		octaveIndex ++;
	}
	return keyBoard;
}

const getTrigger = (instrument) => {
	let triggerType = (layer, note, duration, time) => {
		if (layer.ready) {
			layer.player.triggerAttackRelease(note, duration);
		}
	};
	let noiseType = (layer, note, duration, time) => {
		if (layer.ready) {
			layer.player.triggerAttackRelease(duration, time);
		}
	}
	let getStartType = (layer, note, duration) => {
		if (layer.ready) {
			layer.player.get(note).start(undefined, 0, duration)
		}
	};
	
	switch(instrument) {
		case 'clap': return getStartType;
		case 'hihat': return getStartType;
		case 'tom': return getStartType;
		case 'snare': return noiseType;
		case 'piano': return triggerType;
		case 'kick': return triggerType;
		case 'bass': return triggerType;
		case 'synth': return triggerType;
		case 'membrane': return triggerType;
		default: return false;
	}
}

const getAlter = (instrument) => {
	let setParam = (layer, key, value) => {
		layer.player.set(key, value);
	}
	switch(instrument) {
		case 'clap': return setParam;
		case 'hihat': return setParam;
		case 'tom': return setParam;
		case 'snare': return setParam;
		case 'piano': return setParam;
		case 'kick': return setParam;
		case 'bass': return setParam;
		case 'synth': return setParam;
		case 'membrane': return setParam;
		default: return false;
	}
}

const getSettings = (instrument) => {
	let defaultVal = {
		volume: -10,
		detune: 0,
		grainSize: 0
	};
	switch(instrument) {
		case 'membrane':
			return {
				...defaultVal,
				"pitchDecay": 0.05,
				"octaves": 10,
				"oscillator":{
					"type": "sine"
				},
				"envelope":{
					"attack": 0.001,
					"decay": 0.4,
					"sustain": 0.01,
					"release": 1.4,
				}
			};
		case 'bass':
			return {
				...defaultVal,
				"envelope" : {
					"attack" : 0.1,
					"decay" : 0.3,
					"release" : 2,
				},
				"filterEnvelope" : {
					"attack" : 0.001,
					"decay" : 0.01,
					"sustain" : 0.5,
					"baseFrequency" : 200,
					"octaves" : 2.6
				}
			}
		case 'synth':
			return {
				...defaultVal,
				"oscillator" : {
					"type" : "fatsawtooth",
					"count" : 3,
					"spread" : 30
				},
				"envelope": {
					"attack": 0.01,
					"decay": 0.1,
					"sustain": 0.5,
					"release": 0.4,
					"attackCurve" : "exponential"
				},
			}
		case 'FMSynth':
			return {
				...defaultVal,
				"modulationIndex" : 12.22,
				"envelope" : {
					"attack" : 0.01,
					"decay" : 0.2
				},
				"modulation" : {
					"type" : "square"
				},
				"modulationEnvelope" : {
					"attack" : 0.2,
					"decay" : 0.01
				}
			}
		case 'snare':
			return {
				...defaultVal,
				"volume": -12,
				"noise": {
					"type": 'pink',
					"playbackRate": 3,
				},
				"envelope": {
					"attack": 0.001,
					"decay": 0.13,
					"sustain": 0.01,
					"release": 0.03,
				},
			}
		default: return defaultVal
	}
}
const getPlayer = (instrument, settings, callback, meter) => {
	switch(instrument) {
		case 'clap': return getClapSamples(callback, meter);
		case 'hihat': return getHihatSamples(callback, meter);
		
		//
		case 'membrane': return getMembraneSynth(settings, meter);
		case 'tom': return getTomSamples(callback, meter);
		case 'kick': return getKick(meter);
		
		case 'bass': return getBass(settings, meter);
		case 'synth': return getSynth(settings, meter);
		case 'piano': return getPiano(callback, meter);
		case 'snare': return getSnare(settings, meter);
		// case 'snare': return getSnareSamples(callback, meter);
		default: return false;
	}
}

const getClapSamples = (callback, meter) => {
	return new Tone.Players({
		"808" : `${BASE_URL}/assets/audio/drum-samples/clap-808.wav`,
		"analog" : `${BASE_URL}/assets/audio/drum-samples/clap-analog.wav`,
		"crushed": `${BASE_URL}/assets/audio/drum-samples/clap-crushed.wav`,
		"fat": `${BASE_URL}/assets/audio/drum-samples/clap-fat.wav`,
		"slapper": `${BASE_URL}/assets/audio/drum-samples/clap-slapper.wav`,
		"tape": `${BASE_URL}/assets/audio/drum-samples/clap-tape.wav`,
	}, {
		"volume" : -10,
		"fadeOut" : "64n",
		"onload": callback
	}).connect(meter).fan(AudioVis.fft, AudioVis.waveform).toMaster();
}

const getTomSamples = (callback, meter) => {
	return new Tone.Players({
		"808" : `${BASE_URL}/assets/audio/drum-samples/tom-808.wav`,
		"acoustic01" : `${BASE_URL}/assets/audio/drum-samples/tom-acoustic01.wav`,
		"acoustic02": `${BASE_URL}/assets/audio/drum-samples/tom-acoustic02.wav`,
		"analog": `${BASE_URL}/assets/audio/drum-samples/tom-analog.wav`,
		"chiptune": `${BASE_URL}/assets/audio/drum-samples/tom-chiptune.wav`,
		"fm": `${BASE_URL}/assets/audio/drum-samples/tom-fm.wav`,
		"lofi": `${BASE_URL}/assets/audio/drum-samples/tom-lofi.wav`,
		"rototom": `${BASE_URL}/assets/audio/drum-samples/tom-rototom.wav`,
		"short": `${BASE_URL}/assets/audio/drum-samples/tom-short.wav`
	}, {
		"volume" : -10,
		"fadeOut" : "64n",
		"onload": callback
	}).connect(meter).fan(AudioVis.fft, AudioVis.waveform).toMaster();
}
const getHihatSamples = (callback, meter) => {
	return new Tone.Players({
		"808" : `${BASE_URL}/assets/audio/drum-samples/hihat-808.wav`,
		"acoustic01" : `${BASE_URL}/assets/audio/drum-samples/hihat-acoustic01.wav`,
		"acoustic02": `${BASE_URL}/assets/audio/drum-samples/hihat-acoustic02.wav`,
		"analog": `${BASE_URL}/assets/audio/drum-samples/hihat-analog.wav`,
		"digital": `${BASE_URL}/assets/audio/drum-samples/hihat-digital.wav`,
		"dist01": `${BASE_URL}/assets/audio/drum-samples/hihat-dist01.wav`,
		"dist02": `${BASE_URL}/assets/audio/drum-samples/hihat-dist02.wav`,
		"electro": `${BASE_URL}/assets/audio/drum-samples/hihat-electro.wav`,
		"plain": `${BASE_URL}/assets/audio/drum-samples/hihat-plain.wav`,
		"reso": `${BASE_URL}/assets/audio/drum-samples/hihat-reso.wav`,
		"ring": `${BASE_URL}/assets/audio/drum-samples/hihat-ring.wav`,
	}, {
		"volume" : -10,
		"fadeOut" : "64n",
		"onload": callback
	}).connect(meter).fan(AudioVis.fft, AudioVis.waveform).toMaster();
}

const getSnareSamples = (callback, meter) => {
	return new Tone.Players({
		"808" : `${BASE_URL}/assets/audio/drum-samples/snare-808.wav`,
		"acoustic01" : `${BASE_URL}/assets/audio/drum-samples/snare-acoustic01.wav`,
		"acoustic02": `${BASE_URL}/assets/audio/drum-samples/snare-acoustic02.wav`,
		"analog": `${BASE_URL}/assets/audio/drum-samples/snare-analog.wav`,
		"big": `${BASE_URL}/assets/audio/drum-samples/snare-big.wav`,
		"block": `${BASE_URL}/assets/audio/drum-samples/snare-block.wav`,
		"brute": `${BASE_URL}/assets/audio/drum-samples/snare-brute.wav`,
		"dist01": `${BASE_URL}/assets/audio/drum-samples/snare-dist01.wav`,
		"dist02": `${BASE_URL}/assets/audio/drum-samples/snare-dist02.wav`,
		"dist03": `${BASE_URL}/assets/audio/drum-samples/snare-dist03.wav`,
		"electro": `${BASE_URL}/assets/audio/drum-samples/snare-electro.wav`,
		"lofi01": `${BASE_URL}/assets/audio/drum-samples/snare-lofi01.wav`,
		"lofi02": `${BASE_URL}/assets/audio/drum-samples/snare-lofi02.wav`,
		"modular": `${BASE_URL}/assets/audio/drum-samples/snare-modular.wav`,
		"noise": `${BASE_URL}/assets/audio/drum-samples/snare-noise.wav`,
		"pinch": `${BASE_URL}/assets/audio/drum-samples/snare-pinch.wav`,
		"punch": `${BASE_URL}/assets/audio/drum-samples/snare-punch.wav`,
		"smasher": `${BASE_URL}/assets/audio/drum-samples/snare-smasher.wav`,
		"sumo": `${BASE_URL}/assets/audio/drum-samples/snare-sumo.wav`,
		"tape": `${BASE_URL}/assets/audio/drum-samples/snare-tape.wav`,
		"vinyl01": `${BASE_URL}/assets/audio/drum-samples/snare-vinyl01.wav`,
		"vinyl02": `${BASE_URL}/assets/audio/drum-samples/snare-vinyl02.wav`,
	}, {
		"volume" : 0,
		"fadeOut" : "64n",
		"onload": callback
	}).connect(meter).fan(AudioVis.fft, AudioVis.waveform).toMaster();
}

const getSnare = (settings, meter) => {
	const lowPass = new Tone.Filter({
			frequency: 11000,
		}).toMaster();
	return new Tone.NoiseSynth(settings).connect(meter, lowPass).toMaster();
}

const getKick = (meter) => {
	return new Tone.MembraneSynth({
		"envelope" : {
			"sustain" : 0,
			"attack" : 0.02,
			"decay" : 0.8
		},
		"octaves" : 10
	}).fan(AudioVis.fft, AudioVis.waveform).toMaster().chain(meter);
}

const getMembraneSynth = (settings, meter) => {
	return new Tone.MembraneSynth(settings)
		.connect(meter)
		.fan(AudioVis.fft, AudioVis.waveform)
		.toMaster();
}

const getBass = (settings, meter) => {
	return new Tone.MonoSynth(settings)
		.connect(meter)
		.fan(AudioVis.fft, AudioVis.waveform)
		.toMaster();
}

const getSynth = (settings, meter) => {
	return new Tone.PolySynth(3, Tone.Synth, settings)
		.connect(meter)
		.fan(AudioVis.fft, AudioVis.waveform)
		.toMaster();
}

const getPiano = (callback, meter) => {
	return new Tone.Sampler({
		'A0' : 'A0.mp3',
		'C1' : 'C1.mp3',
		'D#1' : 'Ds1.mp3',
		'F#1' : 'Fs1.mp3',
		'A1' : 'A1.mp3',
		'C2' : 'C2.mp3',
		'D#2' : 'Ds2.mp3',
		'F#2' : 'Fs2.mp3',
		'A2' : 'A2.mp3',
		'C3' : 'C3.mp3',
		'D#3' : 'Ds3.mp3',
		'F#3' : 'Fs3.mp3',
		'A3' : 'A3.mp3',
		'C4' : 'C4.mp3',
		'D#4' : 'Ds4.mp3',
		'F#4' : 'Fs4.mp3',
		'A4' : 'A4.mp3',
		'C5' : 'C5.mp3',
		'D#5' : 'Ds5.mp3',
		'F#5' : 'Fs5.mp3',
		'A5' : 'A5.mp3',
		'C6' : 'C6.mp3',
		'D#6' : 'Ds6.mp3',
		'F#6' : 'Fs6.mp3',
		'A6' : 'A6.mp3',
		'C7' : 'C7.mp3',
		'D#7' : 'Ds7.mp3',
		'F#7' : 'Fs7.mp3',
		'A7' : 'A7.mp3',
		'C8' : 'C8.mp3'
	}, {
		'release' : 1,
		'baseUrl' : `${BASE_URL}/assets/audio/salamander-piano/`,
		'onload' : callback
	})
	.connect(meter)
	.fan(AudioVis.fft, AudioVis.waveform).toMaster();
};