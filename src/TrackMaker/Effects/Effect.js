import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addEffectToLayer, selectEffect, editEffectDetail } from './actions'
import EffectControls from './EffectControls'

class Effect extends Component {
	constructor() {
		super();
		this.bindLayer = this.bindLayer.bind(this);
	}
	bindLayer() {
		let { addEffectToLayer, effect, inLayer } = this.props;
		inLayer.player.addEffect(effect.id) // connects the layer
		addEffectToLayer(effect, inLayer); // updates state
	}
	getBindButton() {
		let { effect, bound } = this.props;
		if (!bound) {
			return <button onClick={this.bindLayer}>bind</button>;
		} else {
			return null;
		}
	}
	getEffect() {
		let { effect, selectEffect } = this.props;
		return <div onClick={selectEffect.bind(this, effect.id)}>
				{effect.type}
			</div>
	}
	getControls() {
		let { selected, bound, effect, editEffectDetail } = this.props;
		if (selected && bound) {
			return <EffectControls 
				effect={effect}
				editEffectDetail={editEffectDetail}
				/>
		}
		return null;
	}
	render() {
		return (
			<div className='Effect'>
				{this.getEffect()}
				{this.getBindButton()}
				{this.getControls()}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let selected = state.track.currentSelection.currentEffect === ownProps.effectId;
	let bound = ownProps.inLayer.effect_ids.indexOf(ownProps.effectId) > -1
	return ({
		effect: state.track.effects[ownProps.effectId],
		selected: selected,
		bound: bound
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addEffectToLayer, selectEffect, editEffectDetail
	}, dispatch)
}

const ConnectedEffect = connect(mapStateToProps, mapDispatchToProps)(Effect)

export default ConnectedEffect