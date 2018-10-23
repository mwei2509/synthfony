import React, { Component } from 'react';
import { getPlayerTypeOptions } from '../../PlayersAndEffects/Load';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { editLayerType, editLayerReady } from '../actions';
import SelectOptions from '../../../Atoms/SelectOptions'

class ChangeInstrument extends Component {
	constructor() {
		super()
		this.playerReady = this.playerReady.bind(this)
		this.editLayerInstrument = this.editLayerInstrument.bind(this)
	}
	playerReady(layerId) {
		let { editLayerReady } = this.props;
		editLayerReady(layerId, true);
	}

	editLayerInstrument(type) {
		let { layer } = this.props;
		let { editLayerType } = this.props;
		editLayerType(layer, type, this.playerReady.bind(this, layer.id), {
			// settings: layer.settings,
			effect_ids: layer.effect_ids
		});
	}
	render() {
		let { layer } = this.props;
		return <SelectOptions
			value={layer.type}
			onSelect={this.editLayerInstrument}
			options={getPlayerTypeOptions()}/>
	}
}

const mapStateToProps = (state, ownProps) => {
	return ({
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		editLayerType, editLayerReady
	}, dispatch)
}

const ConnectedChangeInstrument = connect(mapStateToProps, mapDispatchToProps)(ChangeInstrument)

export default ConnectedChangeInstrument