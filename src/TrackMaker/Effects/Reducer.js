let defaultEffects = {};

export const manageEffects = (state = defaultEffects, action) => {
	switch(action.type) {
		case 'ADD_EFFECT':
			let { newEffect } = action.payload;
			return {
				...state,
				[newEffect.id]: newEffect
			};
		case 'EDIT_EFFECT_DETAIL':
			return {	
				...state,
				[action.payload.effectId]: {
					...state[action.payload.effectId],
					...action.payload.change
				}
			}
		case 'CATCH_UP_TRACK':
			let { effects } = action.payload;
			return effects;
		default:
			return state;
	}
}