import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import { loadProjectIntoPreview } from '../CurrentProject/actions'
import ShowMeter from '../../Playback/ShowMeter'
import Master from '../../Playback/Master'

class ProjectPreview extends Component {
	constructor() {
		super();
		this.state = {
			ready: false
		}
	}
	showPlaying() {
		let { user, slug, title, track_json } = this.props.project;
		let { onSelect } = this.props;
		let currentProject = JSON.parse(track_json);
		if (this.props.playing) {
			let project = loadProjectIntoPreview(this.props.project);
			return <Master
				isPreview={true}
				playing={true}
				trackPlay={project.trackPlay}
				details={project.details}
				layers={project.layers}
			/>
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
		let { loadProjectIntoPreview, onSelect } = this.props;
		return (
			<div className="ProjectPreview">
				<Link to={`/u/${user.username}/${slug}`}>{title}</Link>
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
	}, dispatch)
}

const ConnectedProjectPreview = connect(mapStateToProps, mapDispatchToProps)(ProjectPreview)

export default ConnectedProjectPreview