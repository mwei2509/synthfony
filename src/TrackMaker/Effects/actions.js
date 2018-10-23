import { generateIdWithPrefix } from '../../utils/functions';
import { batchActions } from 'redux-batched-actions';
import { SynthFony } from '../../utils/variables';
import { addPlayerToSynthFony, getNewPlayer } from '../PlayersAndEffects/Load';

const defaultEffect = {
	effect: null,
	type: null,
	settings: {}
};
/**
 *
 */
export const addEffect = (effect) => {
	let effectParams = getEffectParams(effect);
	let newEffect = {
		...defaultEffect,
		...effectParams,
		id: generateIdWithPrefix('E')
	}
	// add to SynthFony
	SynthFony.Effects[newEffect.id] = effect;
	return addEffectToState(newEffect, true);
}

/**
 * Returns new params altered by new effect
 * @param {object} effect
 * @returns {object}
 */
export const getEffectParams = (effect) => {
	// let effect = SynthFony.Players[effect_id];
	return {
		effect: effect,
		type: effect.details.type,
		settings: effect.settings,
		notes: effect.notes
	};
}

/**
 * Adds new layer to state
 * @param {object}
 */
const addEffectToState = (effect, shouldBroadcast) => {
	let actions = [
		{
			type: 'ADD_EFFECT',
			payload: {
				newEffect: effect
			}
		}
	];
	if (shouldBroadcast) {
		actions.push({
			type: 'ADD_EFFECT_TO_BROADCAST',
			payload: {
				newEffect: effect
			}
		})
	}
	return batchActions(actions);
}

export const addEffectToLayer = (effect, layer) => {
	return {
		type: 'ADD_EFFECT_TO_LAYER',
		payload: {
			effectId: effect.id,
			layerId: layer.id
		}
	}
}

export const selectEffect = (effect_id) => {
	return {
		type: 'SELECT_EFFECT',
		payload: effect_id
	}
}

export const editEffectDetail = (effectId, newDetails) => {
	return {
		type: 'EDIT_EFFECT_DETAIL',
		payload: {
			effectId: effectId,
			change: newDetails
		}
	}
}