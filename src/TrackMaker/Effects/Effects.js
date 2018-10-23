import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Effect from './Effect'

class Effects extends Component {
	constructor() {
		super();
	}
	getEffects() {
		let { inLayer, effect_ids } = this.props;
		return effect_ids.map((effect_id) => {
			return <Effect 
				effectId={effect_id}
				inLayer={inLayer}
				/>
		})
	}
	render() {
		return (
			<div className='Effects'>
				{this.getEffects()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		effect_ids: state.track.details.effect_ids
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
	}, dispatch)
}

const ConnectedEffects = connect(mapStateToProps, mapDispatchToProps)(Effects)

export default ConnectedEffects