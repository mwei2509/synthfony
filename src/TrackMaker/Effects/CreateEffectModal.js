import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EffectControls from './EffectControls'
import SelectOptions from '../../Atoms/SelectOptions'
import SettingControls from '../../ReusableComponents/SettingControls'
import { getNewEffect, getEffectTypeOptions } from '../PlayersAndEffects/Load';

export default class CreateEffectModal extends Component {
	constructor() {
		super();
		this.state = {
			type: 'vibrato',
			id: null,
			settings: {}
		}
		this.changeEffect = this.changeEffect.bind(this);
		this.editSettings = this.editSettings.bind(this);
		this.sendNewSettings = this.sendNewSettings.bind(this);
	}

	componentDidMount() {
		this.changeEffect(this.state.type)
	}

	/**
	 * Update state with instrument changes
	 * @param {string} type
	 */
	changeEffect(type) {
		let effect = getNewEffect(type);
		this.setState({
			type: type,
			effect: effect,
			settings: effect.settings
		});
	}

	addEffectButton() {
		let { initEffect } = this.props;
		return <button onClick={initEffect.bind(this, this.state.effect)}>add</button>
	}
	sendNewSettings(newSettings) {
		this.setState({
			settings: newSettings
		});
	}
	editSettings(type, value) {
		this.state.effect.set(type, value);	
	}
	render() {
		return (
			<div>
				<h1>Create Effect</h1>
				<SelectOptions
					label="Effect"
					value={this.state.type}
					onSelect={this.changeEffect}
					options={getEffectTypeOptions()}
				/>
				<SettingControls 
					settings={this.state.settings}
					editSettings={this.editSettings}
					sendNewSettings={this.sendNewSettings}
					/>
				{this.addEffectButton()}
			</div>
		);
	}
}