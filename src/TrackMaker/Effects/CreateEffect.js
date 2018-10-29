import React, { Component } from 'react';
import CreateEffectModal from './CreateEffectModal'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addEffect } from './actions'
import { isObject } from '../../utils/functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

	renderToggleModal() {
		return (
			<span>
				<FontAwesomeIcon icon="plus" />
				{this.props.expanded ? <span className="sidebar-label">Create Effect</span> : null}
			</span>
		)
	}

	render() {
		return (
			<div className="CreateEffect">
				<Modal ref={this.modal}
				 	button={this.renderToggleModal()}>
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