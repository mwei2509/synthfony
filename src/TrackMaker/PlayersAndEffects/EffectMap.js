import Tone from 'tone';

const defaultSettings = {};
const EffectMap = {
	autoFilter: {
		defaultSettings: {
			...defaultSettings,
			frequency: 1,
			type: 'sine',
			depth: 1,
			baseFrequency: 200,
			octaves: 2.6,
			filter: {
				type: 'lowpass',
				rolloff: -12,
				'Q': 1
			}
		},
		getEffect: (settings) => {
			return new Tone.AutoFilter(settings);
		}
	},
	distortion: {
		defaultSettings: {
			...defaultSettings,
			distortion: 0.4,
			oversample: 'none'
		},
		getEffect: (settings) => {
			return new Tone.Distortion(settings);
		}
	},
	phaser: {
		defaultSettings: {
			...defaultSettings,
			frequency: 0.5,
			octaves: 3,
			stages: 10,
			'Q': 10,
			baseFrequency: 350
		},
		getEffect: (settings) => {
			return new Tone.Phaser(settings);
		}
	},
	pingPongDelay: {
		defaultSettings: {
			...defaultSettings,
			"delayTime" : "8n",
			"feedback" : 0.6,
			"wet" : 0.5
		},
		getEffect: (settings) => {
			return new Tone.PingPongDelay(settings);
		}
	},
	pitchShift: {
		defaultSettings: {
			...defaultSettings,
			pitch: 0,
			windowSize: 0.1,
			delayTime: 0,
			feedback: 0
		},
		getEffect: (settings) => {
			return new Tone.PitchShift(settings);
		}
	},
	reverb: {
		defaultSettings: {
			...defaultSettings,
			decay: 1.5,
			preDelay: 0.01
		},
		getEffect: (settings) => {
			return new Tone.Reverb(settings);
		}
	},
	tremolo: {
		defaultSettings: {
			...defaultSettings,
			frequency: 10,
			type: 'sine',
			depth: 0.5,
			spread: 180
		},
		getEffect: (settings) => {
			return new Tone.Tremolo(settings);
		}
	},
	vibrato: {
		defaultSettings: {
			...defaultSettings,
			maxDelay: 0.005,
			frequency: 5,
			depth: 0.1,
			type: 'sine'
		},
		getEffect: (settings) => {
			return new Tone.Vibrato(settings);
		}
	}
}

export default EffectMap;