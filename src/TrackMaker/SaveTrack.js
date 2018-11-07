import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { generateIdWithPrefix } from '../utils/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { saveTrack, editTrackDetail } from './actions'
import { push } from 'react-router-redux'
import Modal from '../Atoms/Modal'
import InputForm from '../Atoms/InputForm'
import './style.css';

class SaveTrack extends Component {
	constructor() {
		super();
		this.saveTrack = this.saveTrack.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	saveTrack() {
		let { push, track, saveTrack, trackPlay } = this.props;
		let trackJson = {
			...track,
			trackPlay: trackPlay,
			layers: {},
			effects: {}
		};
		delete trackJson.currentSelection;
		delete trackJson.playback;
		Object.keys(track.layers).forEach((layer_id) => {
			trackJson.layers[layer_id] = {
				...track.layers[layer_id],
				player: null
			}
		})
		Object.keys(track.effects).forEach((effect_id) => {
			trackJson.effects[effect_id] = {
				...track.effects[effect_id],
				effect: null
			}
		})
		saveTrack({
			title: track.details.title,
			public: track.details.public,
			track_json: JSON.stringify(trackJson)
		}, (data) => {
			let { user, slug } = data.data;
			push(`/u/${user.username}/${slug}/edit`);
		});
	}
	
	loadTrack() {
		debugger;
	}
	renderToggleModal() {
		return (
			<button className="icon">
				<FontAwesomeIcon icon="save" />
				{this.props.expanded ? <span className="sidebar-label">Save Track</span> : null}
			</button>
		)
	}
	handleChange(field, value) {
		let { editTrackDetail } = this.props;
		editTrackDetail({[field]: value})
	}
	render() {
		return (
			<div className='SaveTrack'>
				<Modal button={this.renderToggleModal()}>
					<InputForm
						fields={[
							{
								name: 'title', 
								value: this.props.track.details.title,
								type: 'input'
							}
						]}
						onChange={this.handleChange}
						/>
					<button onClick={this.saveTrack}>SAVE</button>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		track: state.track,
		trackPlay: state.track.playback.trackPlay
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		saveTrack, editTrackDetail, push
	}, dispatch)
}

const ConnectedSaveTrack = connect(mapStateToProps, mapDispatchToProps)(SaveTrack)

export default ConnectedSaveTrack