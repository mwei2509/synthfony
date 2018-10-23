import React, { Component } from 'react';
import SettingControls from '../../ReusableComponents/SettingControls'

export default class EffectControls extends Component {
	constructor() {
		super()
		this.editSettings = this.editSettings.bind(this);
		this.sendNewSettings = this.sendNewSettings.bind(this);
	}
	editSettings(type, value) {
		let { effect } = this.props;
		effect.effect.set(type, value);
	}
	sendNewSettings(newSettings) {
		let { effect, editEffectDetail } = this.props;
		editEffectDetail(effect.id, {
			settings: newSettings
		});
	}
	render() {
		let { effect } = this.props;
		return (
			<SettingControls 
				settings={effect.settings}
				editSettings={this.editSettings}
				sendNewSettings={this.sendNewSettings}
				/>
		);
	}
}