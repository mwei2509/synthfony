import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SettingControls from '../../ReusableComponents/SettingControls'
import SelectOptions from '../../Atoms/SelectOptions'
import { getNewPlayer, getPlayerTypeOptions } from '../PlayersAndEffects/Load';
import Piano from '../Instruments/Piano'
import Drums from '../Instruments/Drums'

export default class CreateLayerModal extends Component {
	constructor() {
		super();
		this.state = {
			ready: false,
			type: 'bass',
			id: null,
			settings: {},
			effect_ids: [],
			notes: [],
			instrument: null
		}
		this.editSettings = this.editSettings.bind(this);
		this.sendNewSettings = this.sendNewSettings.bind(this);
		this.changeInstrument = this.changeInstrument.bind(this);
		this.playNote = this.playNote.bind(this);
	}

	componentDidMount() {
		this.changeInstrument(this.state.type)
	}

	/**
	 * Update state with instrument changes
	 * @param {string} type
	 */
	changeInstrument(type) {
		let player = getNewPlayer(type, function(){
			this.setState({
				ready: true
			});
		}.bind(this));
		this.setState({
			ready: player.details.ready,
			type: type,
			player: player,
			settings: player.settings,
			effect_ids: player.effect_ids,
			notes: player.notes,
			instrument: player.instrument
		});
	}

	addLayerButton() {
		let { initLayer } = this.props;
		if (this.state.ready) {
			return <button onClick={initLayer.bind(this, this.state.player)}>add</button>
		}
		return null;
	}
	sendNewSettings(newSettings) {
		this.setState({
			settings: newSettings
		});
	}
	editSettings(type, value) {
		this.state.player.set(type, value);
	}
	playNote(note) {
		this.state.player.trigger(note, '16n');
	}
	showInstrument() {
		let notes = [...this.state.notes].splice(this.state.notes.length/2, 3);
		return <Drums notes={notes} playNote={this.playNote}/>
		// switch(this.state.instrument) {
		// 	case 'piano': return <Piano playNote={this.playNote}/>
		// 	case 'drums': return <Drums notes={this.state.notes} playNote={this.playNote}/>
		// 	default: return null;
		// }
	}
	render() {
		return (
			<div>
				<h1>Create Layer</h1>
				<SelectOptions
					value={this.state.type}
					onSelect={this.changeInstrument}
					options={getPlayerTypeOptions()}
					/>
				{this.showInstrument()}
				<SettingControls 
					settings={this.state.settings}
					editSettings={this.editSettings}
					sendNewSettings={this.sendNewSettings}
					/>
				{this.addLayerButton()}
			</div>
		);
	}
}