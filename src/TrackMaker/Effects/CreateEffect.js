import React, { Component } from 'react';
import CreateEffectModal from './CreateEffectModal'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addEffect } from './actions'
import { isObject } from '../../utils/functions'
import Modal from '../../Atoms/Modal';

class CreateEffect extends Component {
	constructor() {
		super();
		this.initEffect = this.initEffect.bind(this);
		this.modal = React.createRef();
	}

	initEffect(effect) {
		let { addEffect } = this.props;
		addEffect(effect);
		this.modal.current.close();
	}

	render() {
		return (
			<div className="CreateEffect">
				<Modal ref={this.modal} icon="plus">
					<CreateEffectModal initEffect={this.initEffect} />
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	let currentEffectId = state.track.currentSelection.currentEffect;
	let currentEffect = currentEffectId ? state.track.effects[currentEffectId] : null;
	return ({
		currentEffect: currentEffect
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addEffect
	}, dispatch)
}

const ConnectedCreateEffect = connect(mapStateToProps, mapDispatchToProps)(CreateEffect)

export default ConnectedCreateEffect