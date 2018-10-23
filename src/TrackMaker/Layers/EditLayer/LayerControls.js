import React, { Component } from 'react';
import SettingControls from '../../../ReusableComponents/SettingControls'

export default class LayerControls extends Component {
	constructor() {
		super()
		this.editSettings = this.editSettings.bind(this);
		this.sendNewSettings = this.sendNewSettings.bind(this);
	}
	editSettings(type, value) {
		let { layer } = this.props;
		layer.player.set(type, value);
	}
	sendNewSettings(newSettings) {
		let { layer, editLayerDetail } = this.props;
		editLayerDetail(layer, {
			settings: newSettings
		});
	}
	render() {
		let { layer } = this.props;
		return (
			<SettingControls 
				settings={layer.settings}
				editSettings={this.editSettings}
				sendNewSettings={this.sendNewSettings}
				/>
		);
	}
}