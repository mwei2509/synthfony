import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import VerticalRange from '../../Atoms/VerticalRange'
import { editLayerDetail } from '../actions'

class LayerControls extends Component {
	constructor() {
		super()
		this.changeNumericSetting = this.changeNumericSetting.bind(this)
	}
	changeNumericSetting(type, value) {
		let { layer, editLayerDetail } = this.props;
		let keys = type.split('.');
		let details;
		if (keys.length == 2) {
			details = {
				settings: {					
					...layer.settings,
					[keys[0]]: {
						...layer.settings[keys[0]],
						[keys[1]]: value
					}
				}
			}
		} else {
			details = {
				settings: {					
					...layer.settings,
					[type]: value
				}
			}
		}
		editLayerDetail(layer.id, details);
		window.setTimeout(layer.alterPlayer.bind(this, layer, type, Number(value)));
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

	getVerticalControls() {
		let { settings } = this.props.layer;
		let controls = [];
		for (let key in settings) {
			if (settings.hasOwnProperty(key)) {
				let controlKey, controlVal;
				if (this.isNumber(settings[key])) {
					controlKey = key;
					controlVal = settings[key];
					let { min, max, step } = this.getMinMaxStep(controlKey);
					controls.push({
						key: controlKey,
						value: controlVal,
						min: min,
						max: max,
						step: step
					})
				} else if (typeof settings[key] === 'object') {
					Object.keys(settings[key]).forEach((objKey) => {
						controlKey = `${key}.${objKey}`;
						controlVal = settings[key][objKey];
						if (this.isNumber(controlVal)) {							
							let { min, max, step } = this.getMinMaxStep(controlKey);
							controls.push({
								key: controlKey,
								value: controlVal,
								min: min,
								max: max,
								step: step
							});
						}
					})
				}
			}
		}
		return controls.map((control) => {
			console.log(control);
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
	isNumber(num) {
		return !isNaN(Number(num));
	}
	render() {
		let { layer } = this.props;
		return (
			<div className='LayerControls'>
				{this.getVerticalControls()}
			</div>
		);
	}
// }envelope: {
// 	attack: 0.005,
// 	decay: 0.1,
// 	sustain: 0.3,
// 	release: 1
}

const mapStateToProps = (state) => {
	return ({
		layers: state.track.layers
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		editLayerDetail
	}, dispatch)
}

const ConnectedLayerControls = connect(mapStateToProps, mapDispatchToProps)(LayerControls)

export default ConnectedLayerControls