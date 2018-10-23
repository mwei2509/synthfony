import PlayerMap from './PlayerMap';
import Effects from './Effect';
import Tone from 'tone';
import { SynthFony } from '../../utils/variables'
import { isObject } from '../../utils/functions'

/**
 * Sets up a new "player" layers
 * @param {string} type - instrument type, e.g. piano, bass
 * @param {function} callback - optional
 * @param {object} override - optional
 * @returns {object} settings
 */
class Player {
	constructor(type, callback, override) {
		this.callback = callback;
		this.defaultOverride = {
			settings: {},
			effect_ids: []
		};
		this.override = {
			...this.defaultOverride,
			...(override ? override : {})
		};
		this.details = {
			type: type,
			instrument: null,
			ready: false
		};
		this.init();
	}

	init = () => {
		this.setUpPlayer();
		this.getVisuals();
		this.connectEffects();
		this.connectToAmp();
	}

	setUpPlayer = () => {
		let instrument = PlayerMap[this.details.type];
		this.settings = {
			...instrument.defaultSettings,
			...this.override.settings
		};
		this.details.instrument = instrument.instrument;
		this.player = instrument.getPlayer(this.settings, this.setReady.bind(this));
		this.notes = instrument.notes ? Object.keys(instrument.notes) : this.generateKeys();
	}

	getVisuals = () => {
		this.meter = new Tone.Meter();
		this.fft = new Tone.FFT(32);
		this.waveform = new Tone.Waveform(1024);
		this.player.connect(this.meter).fan(this.fft, this.waveform);
	}
	
	connectEffects = () => {
		this.effect_ids = this.override.effect_ids || [];
		this.effect_ids.forEach((effect_id) => {
			let effect = SynthFony.Effects[effect_id];
			this.player.connect(effect.player);
		})
	}

	addEffect = (effect_id) => {
		this.effect_ids.push(effect_id);
		let effect = SynthFony.Effects[effect_id];
		this.player.connect(effect.player);
	}
	
	connectToAmp = () => {
		this.player.toMaster();
	}
	/**
	 * Returns 88 key keyboard
	 * @returns {array}
	 */
	generateKeys = () => {
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

	/**
	 * Set param on player
	 * @param {string} key
	 * @param {string} value
	 */
	set = (key, value) => {
		if (key.indexOf('.') > -1) {
			var attrs = key.split('.');
			// currently only 2 so don't bother looping, may have to introduce looping if there's more nesting
			this.settings[attrs[0]][attrs[1]] = value;
		} else {
			this.settings[key] = value;
		}
		return this.player.set(key, value);
	}
	
	trigger = (note, duration, time) => {
		let instrument = PlayerMap[this.details.type];
		switch(true) {
			case instrument.isNoNoteTrigger: return this.player.triggerAttackRelease(duration, time);
			case instrument.isStart: return this.player.get(note).start(undefined, 0, duration);
			case instrument.isNoNoteStart: return this.player.start(undefined, 0, duration);
			default: return this.player.triggerAttackRelease(note, duration);
		}
	}

	setReady = () => {
		let instrument = PlayerMap[this.details.type];
		this.details.ready = true;
		if (typeof this.callback === 'function' && instrument.async) {
			this.callback();
		}
	}

	// return {
	// 	// details
	// 	player: this.player,
	// 	details: this.details,
	// 	notes: this.notes,
	// 	// actions
	// 	set: this.set,
	// 	trigger: this.trigger,
	// 	// overridable
	// 	settings: this.settings,
	// 	effect_ids: this.effect_ids,
	// 	// visuals
	// 	meter: this.meter,
	// 	fft: this.fft,
	// 	waveform: this.waveform
	// }
}

export default Player;