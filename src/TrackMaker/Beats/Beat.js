import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Division from '../Divisions/Division';
import { makeArrayWithIndex } from '../../utils/functions'
import './style.css'

class Beat extends Component {
	showDivisions() {
		let { layerId, measureIndex, beatIndex, pulsePerBeat } = this.props;
		return makeArrayWithIndex(pulsePerBeat).map((index) => {
			return <Division
				layerId={layerId}
				measureIndex={measureIndex}
				beatIndex={beatIndex}
				divisionIndex={index}
			/>
		})
		// return beat.division_ids.map((div_id, index) => {
		// 	return <Division measureIndex={measureIndex} beatIndex={beatIndex} divisionIndex={index} divisionId={div_id}/>
		// });
	}

	render() {
		return (
			<div className="Beat">
				{this.showDivisions()}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return ({
		pulsePerBeat: state.track.details.pulsePerBeat
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({}, dispatch)
}

const ConnectedBeat = connect(mapStateToProps, mapDispatchToProps)(Beat)

export default ConnectedBeat