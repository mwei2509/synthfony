import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Division from '../Divisions/Division';
import './style.css'

class Beat extends Component {

	showDivisions() {
		let { beat } = this.props;
		return beat.division_ids.map((div_id, index) => {
			return <Division key={index} divisionId={div_id}/>
		});
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
		beat: state.track.beats[ownProps.beatId]
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({}, dispatch)
}

const ConnectedBeat = connect(mapStateToProps, mapDispatchToProps)(Beat)

export default ConnectedBeat