import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import { fetchProjects } from './actions'
import { getTimeInMs, getTimeDiffMs } from '../../utils/functions'
import ProjectPreview from './ProjectPreview'
import './style.css'

class ProjectListing extends Component {
	constructor() {
		super();
		this.state = {
			playingId: null
		}
		this.switchPlay = this.switchPlay.bind(this)
	}
	
	getProjects() {
		let { relevantListing, fetchProjects } = this.props;
		let lastUpdate = relevantListing.info.lastUpdated;
		let now = getTimeInMs();
		let timeSinceLastUpdate = getTimeDiffMs(lastUpdate, now);
		console.log('time since last update: ' + timeSinceLastUpdate);
		let hasBeenFiveMinutes = timeSinceLastUpdate >= 300000;
		if (lastUpdate === null || hasBeenFiveMinutes) {
			fetchProjects(this.props.type);
		}
	}
	
	componentDidMount() {
		this.getProjects();
	}
	componentDidUpdate() {
		this.getProjects();
	}
	switchPlay(id) {
		this.setState({
			playingId: id
		})
	}
	showProjects() {
		let { projects } = this.props.relevantListing;
		return projects.map((project, index) => {
			let playing = index === this.state.playingId
			return <ProjectPreview
				onSelect={this.switchPlay.bind(this, index)}
				playing={playing}
				project={project}
				/>
		})
	}
	render() {
		return (
			<div className="ProjectListing">
				{this.showProjects()}
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	let relevantListing = state.projects.listing[ownProps.type]
	return ({
		relevantListing: relevantListing
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		push, fetchProjects
	}, dispatch)
}

const ConnectedProjectListing = connect(mapStateToProps, mapDispatchToProps)(ProjectListing)

export default ConnectedProjectListing