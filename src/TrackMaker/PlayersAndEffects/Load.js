import { SynthFony } from '../../utils/variables'
import { generateIdWithPrefix } from '../../utils/functions'
import Player from './Player';
import PlayerMap from './PlayerMap'
import Effect from './Effect';
import EffectMap from './EffectMap'
import Tone from 'tone'

export const masterLayer = {}

export const clearPlayer = () => {
	masterLayer.meter = null;
	masterLayer.fft = null;
	masterLayer.waveform = null;
}

export const initPlayer = () => {
	masterLayer.meter = new Tone.Meter();
	masterLayer.fft = new Tone.FFT(32);
	masterLayer.waveform = new Tone.Waveform(1024);
}

/**
 * Creates and returns a new player object
 * @param {string} typeOfPlayer - e.g. piano, snare, synth, etc
 * @param {function} onloadCallback
 * @param {object} optionsOverride
 * @returns {object}
 */
export const getNewPlayer = (typeOfPlayer, onloadCallback, optionsOverride) => {
	if (!masterLayer.meter) {
		initPlayer();
	}
	return new Player(typeOfPlayer, onloadCallback, optionsOverride, masterLayer);
}

/**
 * Returns an array of player types, e.g. ['snare','piano']
 * @returns {array}
 */
const getPlayerTypes = () => {
	return Object.keys(PlayerMap);
}

/**
 * Returns an array of player types with labels to use in select dropdowns
 * @returns {array}
 */
export const getPlayerTypeOptions = () => {
	return getPlayerTypes().map((type) => {
		return {
			value: type,
			label: type.toUpperCase()
		};
	});
}

/**
 * Creates and returns a new effect object
 * @param {string} typeOfEffect - e.g. vibrato,filter,etc
 * @param {object} optionsOverride
 * @returns {object}
 */
export const getNewEffect = (typeOfEffect, optionsOverride) => {
	return new Effect(typeOfEffect, optionsOverride);
}

/**
 * Returns an array of effect types, e.g. ['vibrato']
 * @returns {array}
 */
const getEffectTypes = () => {
	return Object.keys(EffectMap);
}

/**
 * Returns an array of effect types with labels to use in select dropdowns
 * @returns {array}
 */
export const getEffectTypeOptions = () => {
	return getEffectTypes().map((type) => {
		return {
			value: type,
			label: type.toUpperCase()
		};
	});
}
