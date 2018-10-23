import EffectMap from './EffectMap';

class Effect {
	constructor(type, override) {
		this.defaultOverride = {
			settings: {}
		};
		this.override = {
			...this.defaultOVerride,
			...(override ? override : {})
		};
		this.details = {
			type: type
		};
		this.init();
	}
	
	init = () => {
		this.setUpEffect();
		this.connectToAmp();
	}

	setUpEffect = () => {
		let effect = EffectMap[this.details.type];
		this.settings = {
			...effect.defaultSettings,
			...this.override.settings
		};
		this.player = effect.getEffect(this.settings);
	}
	
	/**
	 * Set param on effect
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

	connectToAmp = () => {
		this.player.toMaster();
	}
}

export default Effect;