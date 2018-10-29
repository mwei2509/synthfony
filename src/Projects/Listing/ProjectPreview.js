import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import { loadProjectIntoTrack } from '../CurrentProject/actions'
import ShowMeter from '../../TrackMaker/Playback/ShowMeter'
import Master from '../../TrackMaker/Playback/Master'

class ProjectPreview extends Component {
	constructor() {
		super();
	}
	showPlaying() {
		let { user, slug, title, track_json } = this.props.project;
		let { loadProjectIntoTrack, onSelect } = this.props;
		let currentProject = JSON.parse(track_json);
		if (this.props.playing) {
			loadProjectIntoTrack(this.props.project, ()=>{})
			return <Master />
		} else {
			return <ShowMeter 
				meter={currentProject.trackPlay.meter}
				maxMeter={currentProject.trackPlay.maxMeter}
				progress={0}
			/>
		}
	}
	render() {
		let { user, slug, title, track_json } = this.props.project;
		let { loadProjectIntoTrack, onSelect } = this.props;
		return (
			<div className="ProjectPreview">
				<Link to={`/u/${user.username}/${slug}`}>${title}</Link>
				<button onClick={onSelect.bind(this)}>Play</button>
				{this.showPlaying()}
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return ({
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		loadProjectIntoTrack
	}, dispatch)
}

const ConnectedProjectPreview = connect(mapStateToProps, mapDispatchToProps)(ProjectPreview)

export default ConnectedProjectPreview