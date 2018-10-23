import React, { Component } from 'react'
import VerticalRange from '../Atoms/VerticalRange'
import SelectOptions from '../Atoms/SelectOptions'
import { isNumber, isString, isObject } from '../utils/functions'
import './style.css'

export default class SettingControls extends Component {
	constructor() {
		super()
		this.changeNumericSetting = this.changeNumericSetting.bind(this)
	}
	changeNumericSetting(type, value) {
		let { sendNewSettings, editSettings } = this.props;
		let newSettings = this.getNewSettings(value);
		sendNewSettings(newSettings);
		editSettings(type, Number(value));
	}
	changeOption(type, value) {
		let { sendNewSettings, editSettings } = this.props;
		let newSettings = this.getNewSettings(value);
		sendNewSettings(newSettings);
		editSettings(type, value);
	}
	getNewSettings(type, value) {
		let { settings } = this.props;
		let keys = type.split('.');
		let newSettings = {...settings};
		let settingsPointer = settings;
		let currentPointer = newSettings;
		for(let i = 0; i < keys.length; i++) {
			var last = i === keys.length - 1;
			let key = keys[i];
			if (!last) {
				currentPointer[key] = {...settingsPointer[key]}
				settingsPointer = settingsPointer[key];
				currentPointer = currentPointer[key];
			} else {
				currentPointer[key] = value;
			}
		}
		return newSettings;
	}
	getMinMaxStep(type) {
		switch(type) {
			case 'volume':
				return { min: '-15', max: '20', step: '1'}
			case 'detune':
				return { min: '-1200', max: '1200', step: '5'}
			case 'grainSize':
				return { min: '0.01', max: '0.2', step: '.001'}
			// attacks
			case 'envelope.attack': 
			case 'filterEnvelope.attack':
			case 'modulationEnvelope.attack':
				return { min: '0.001', max: '1', step: '.005'}
			// decays
			case 'envelope.decay': 
			case 'filterEnvelope.decay':
			case 'modulationEnvelope.decay':
				return { min: '0.001', max: '1', step: '.005'}
			// sustain
			case 'envelope.sustain': 
			case 'filterEnvelope.sustain':
				return { min: '0.001', max: '1', step: '.005'}
			// release
			case 'envelope.release': 
			case 'filterEnvelope.release':
				return { min: '0.001', max: '5', step: '.1'}
			
			case 'filterEnvelope.octaves':
				return { min: '1', max: '10', step: '1'}
			case 'filterEnvelope.baseFrequency':
				return { min: '50', max: '400', step: '1'}
			case 'modulationIndex':
				return { min: '1', max: '15', step: '0.01'}
			default: 
				return { min: '0', max: '10', step: '1'}
		}
	}

	getOptions(type) {
		switch(type) {
			case 'noise.type': 
				return ['white', 'pink', 'brown'];
			case 'type':
			case 'modulation.type':
			case 'voice0.oscillator.type':
			case 'voice1.oscillator.type':
			case 'oscillator.type': 
				return ['sine', 'square', 'triangle', 'sawtooth', 'fatsawtooth'];
			case 'envelope.attackCurve': 
				return ['linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step'];
			case 'fadeOut':
				return ['1n','2n','4n','8n','16n','32n','64n']
			default: return []
		}
	}

	flattenObj(obj, controls, lastKey) {
		controls = controls || [];
		let controlKey, controlVal;
		
		Object.keys(obj).forEach((key) => {			
			if (isNumber(obj[key])) {
				controlKey = lastKey ? lastKey + '.' + key : key;
				controlVal = obj[key];
				let { min, max, step } = this.getMinMaxStep(controlKey);
				controls.push({
					key: controlKey,
					value: controlVal,
					min: min,
					max: max,
					step: step,
					type: 'numeric'
				})
			} else if (isString(obj[key])) {
				controlKey = lastKey ? lastKey + '.' + key : key;
				controlVal = obj[key];
				controls.push({
					key: controlKey,
					value: controlVal,
					options: this.getOptions(controlKey).map((option) => {
						return {
							value: option,
							label: option
						}
					}),
					type: 'select'
				});
			} else if (isObject(obj[key])) {
				return this.flattenObj(obj[key], controls, lastKey ? `${lastKey}.${key}` : key);
			}
		});
		return controls;
	}

	getVerticalControls(controls) {
		return controls.filter(control=>control.type === 'numeric').map((control) => {
			// console.log(control);
			return <VerticalRange 
				label={control.key}
				action={this.changeNumericSetting.bind(this, control.key)}
				value={control.value}
				min={control.min}
				max={control.max}
				step={control.step}
				/>
		})
	}

	getOptionsControls(controls) {
		return controls.filter(control=>control.type === 'select').map((control) => {
			// console.log(control);
			return <SelectOptions
				label={control.key}
				options={control.options}
				onSelect={this.changeOption.bind(this, control.key)}
				value={control.value}
				/>
		})
	}

	render() {
		let { settings } = this.props;
		let controls = this.flattenObj(settings);
		return (
			<div>
				<div className='SettingControls'>
					{this.getVerticalControls(controls)}
				</div>
				<div className='OptionControls'>
					{this.getOptionsControls(controls)}
				</div>
			</div>
		);
	}
}