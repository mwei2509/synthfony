import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import { SynthFony } from '../utils/variables'
import { clearUser, logout, refreshUser } from './actions' // session actions
import { editLayerReady } from './Layers/actions'
import { initPlayer } from './PlayersAndEffects/Load'
import { fetchProject, loadProjectIntoTrack } from '../Projects/CurrentProject/actions';
import { newProject } from './actions';
import Layers from './Layers/Layers'
import Playback from '../Playback/index'
import TrackDetails from './TrackDetails'

class CreateTrack extends Component {

	componentDidMount(){
		this.loadCorrectProject();
	}
	loadCorrectProject() {
		let { path, params } = this.props.match;
		let { newProject, editLayerReady, fetchProject, loadProjectIntoTrack, currentProject, loadedTrackProjectId } = this.props;
		if (path === '/create') {
			return newProject();
		}
		if (params.track_slug) {
			let loadedCorrectly = ((params.track_slug === currentProject.slug) && (currentProject.project_id === loadedTrackProjectId))
			if (loadedCorrectly) {
				return;
			}
			
			let noCurrentProj = !currentProject.project_id;
			if (noCurrentProj) {
				return fetchProject(params.username, params.track_slug)
			}
			let noLoadedTrack = !loadedTrackProjectId;
			if (noLoadedTrack) {
				return loadProjectIntoTrack(currentProject, (layerId) => {
					editLayerReady(layerId, true);
				});
			}
		}
	}

	componentDidUpdate() {
		this.loadCorrectProject();
	}

	shouldComponentUpdate(nextProps) {
		let locationChanged = nextProps.location.pathname !== this.props.location.pathname;
		let loginStatusChanged = nextProps.loggedIn !== this.props.loggedIn;
		let currentProjectChanged = nextProps.currentProject.project_id !== this.props.currentProject.project_id;
		return locationChanged || loginStatusChanged || currentProjectChanged;
	}

	render() {
		return <div>
				<TrackDetails />
				<Playback isMaster={true}/>
				<Layers />
			</div>
	}
}

const mapStateToProps = (state) => {
	return ({
		currentProject: state.projects.currentProject,
		loadedTrackProjectId: state.track.details.project_id
	})
}
	
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		fetchProject, loadProjectIntoTrack, editLayerReady, newProject
	}, dispatch)
}

const ConnectedCreateTrack = connect(mapStateToProps, mapDispatchToProps)(CreateTrack)

export default ConnectedCreateTrack
