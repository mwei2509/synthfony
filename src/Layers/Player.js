import PlayerMap from './PlayerMap';
import Effects from './Effects';
import Tone from 'tone';
import { SynthFony } from '../utils/variables'

/**
 * Sets up a new "player" layers
 * @param {string} type - instrument type, e.g. piano, bass
 * @param {function} callback - optional
 * @param {object} override - optional
 * @returns {object} settings
 */
export function Player(type, callback, override){
	this.callback = callback;
	this.type = type;
	this.override = override || {};
	this.ready = false;

	this.init = () => {
		this.setUpPlayer();
		this.getVisuals();
		this.connectEffects();
		this.connectToAmp();
		// connect player
		this.ready();
	}

	this.setUpPlayer = () => {
		let instrument = PlayerMap[this.type];
		this.settings = this.override.settings || instrument.defaultSettings;
		this.player = instrument.getPlayer(this.settings, this.ready);
		this.notes = instrument.notes || this.generateKeys();
	}

	this.getVisuals = () => {
		this.meter = new Tone.Meter();
		this.fft = new Tone.FFT(32);
		this.waveform = new Tone.Waveform(1024);
		this.player.connect(this.meter).fan(this.fft, this.waveform);
	}
	
	this.connectEffects = () => {
		this.effects = this.override.effects || [];
		this.effects.forEach((effect_id) => {
			let effect = SynthFony.Effects[effect_id];
			this.player.connect(effect.player);
		})
	}
	
	this.connectToAmp = () => {
		this.player.toMaster();
	}
	/**
	 * Returns 88 key keyboard
	 * @returns {array}
	 */
	this.generateKeys = () => {
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
	this.set = (key, value) => {
		this.player.set(key, value);
	}

	this.trigger = () => {
		let instrument = PlayerMap[this.type];
	}

	this.ready = () => {
		let instrument = PlayerMap[this.type];
		this.ready = true;
		// if async instrument, callback will change state to ready, if not, state will be ready on init
		if (typeof this.callback === 'function' && instrument.async) {
			this.callback()
		}
	}

	this.init();

	return {
		player: this.player,
		set: this.set,
		trigger: this.trigger,
		ready: this.ready
		// overridable
		settings: this.settings,
		effects: this.effects,
		notes: this.notes,
	}
}