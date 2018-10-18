import { BASE_URL } from '../utils/variables';
import Tone from 'tone';

const PlayerMap = {
	piano: {
		defaultSettings: {
			volume: 0,
			attack: 0,
			release: 0.1
		},
		notes: { 'A0':'A0.mp3', 'C1':'C1.mp3', 'D#1':'Ds1.mp3', 'F#1':'Fs1.mp3', 'A1':'A1.mp3', 'C2':'C2.mp3', 'D#2':'Ds2.mp3', 'F#2':'Fs2.mp3', 'A2':'A2.mp3', 'C3':'C3.mp3', 'D#3':'Ds3.mp3', 'F#3':'Fs3.mp3', 'A3':'A3.mp3', 'C4':'C4.mp3', 'D#4':'Ds4.mp3', 'F#4':'Fs4.mp3', 'A4':'A4.mp3', 'C5':'C5.mp3', 'D#5':'Ds5.mp3', 'F#5':'Fs5.mp3', 'A5':'A5.mp3', 'C6':'C6.mp3', 'D#6':'Ds6.mp3', 'F#6':'Fs6.mp3', 'A6':'A6.mp3', 'C7':'C7.mp3', 'D#7':'Ds7.mp3', 'F#7':'Fs7.mp3', 'A7':'A7.mp3', 'C8':'C8.mp3' },
		getPlayer: (settings, callback) => {
			settings.baseUrl = `${BASE_URL}/assets/audio/salamander-piano/`;
			settings.onload = callback;
			return new Tone.Sampler(PlayerMap.piano.notes, settings);
		}
	},
	clap: {
		defaultSettings: {
			volume: -10,
			fadeOut: '64n'
		},
		notes: {
			"808" : `${BASE_URL}/assets/audio/drum-samples/clap-808.wav`,
			"analog" : `${BASE_URL}/assets/audio/drum-samples/clap-analog.wav`,
			"crushed": `${BASE_URL}/assets/audio/drum-samples/clap-crushed.wav`,
			"fat": `${BASE_URL}/assets/audio/drum-samples/clap-fat.wav`,
			"slapper": `${BASE_URL}/assets/audio/drum-samples/clap-slapper.wav`,
			"tape": `${BASE_URL}/assets/audio/drum-samples/clap-tape.wav`,
		},
		getPlayer: (settings, callback) => {
			settings.onload = callback;
			return new Tone.Players(PlayerMap.clap.notes, settings);
		}
	},
	hihat: {
		defaultSettings: {
			volume: -10,
			fadeOut: '64n'
		},
		notes: {
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
		},
		getPlayer: (settings, callback) => {
			settings.onload = callback;
			return new Tone.Players(PlayerMap.hihat.notes, settings);
		}
	},
	tom: {
		defaultSettings: {
			volume: -10,
			fadeOut: '64n'
		},
		notes: {
			"808" : `${BASE_URL}/assets/audio/drum-samples/tom-808.wav`,
			"acoustic01" : `${BASE_URL}/assets/audio/drum-samples/tom-acoustic01.wav`,
			"acoustic02": `${BASE_URL}/assets/audio/drum-samples/tom-acoustic02.wav`,
			"analog": `${BASE_URL}/assets/audio/drum-samples/tom-analog.wav`,
			"chiptune": `${BASE_URL}/assets/audio/drum-samples/tom-chiptune.wav`,
			"fm": `${BASE_URL}/assets/audio/drum-samples/tom-fm.wav`,
			"lofi": `${BASE_URL}/assets/audio/drum-samples/tom-lofi.wav`,
			"rototom": `${BASE_URL}/assets/audio/drum-samples/tom-rototom.wav`,
			"short": `${BASE_URL}/assets/audio/drum-samples/tom-short.wav`
		},
		getPlayer: (settings, callback) => {
			settings.onload = callback;
			return new Tone.Players(PlayerMap.tom.notes, settings);
		}
	},
	snare: {
		defaultSettings: {
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
		},
		getPlayer: (settings, callback) => {
			return new Tone.NoiseSynth(settings);
		}
	},
	bass: {
		defaultSettings: {
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
		},
		getPlayer: (settings, callback) => {
			return new Tone.MonoSynth(settings);
		}
	},
	kick: {
		defaultSettings: {
			"envelope" : {
				"sustain" : 0,
				"attack" : 0.02,
				"decay" : 0.8
			},
			"octaves" : 10
		},
		getPlayer: (settings, callback) => {
			return new Tone.MembraneSynth(settings);
		}
	},
	synth: {
		defaultSettings: {
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
		},
		getPlayer: (settings, callback) => {
			return new Tone.PolySynth(3, Tone.Synth, settings);
		}
	},
	membrane: {
		defaultSettings: {
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
		},
		getPlayer: (settings, callback) => {
			return new Tone.MembraneSynth(settings);
		}
	}
}

export default PlayerMap;