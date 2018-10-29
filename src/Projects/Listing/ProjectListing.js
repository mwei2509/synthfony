import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import { fetchProjects } from './actions'
import ProjectPreview from './ProjectPreview'

class ProjectListing extends Component {
	constructor() {
		super();
		this.state = {
			playingId: null
		}
		this.switchPlay = this.switchPlay.bind(this)
	}
	getProjects() {
		let { fetchProjects } = this.props;
		if (this.props.type !== this.props.listing.info.type) {
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
		let { projects } = this.props.listing;
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
const mapStateToProps = (state) => {
	return ({
		listing: state.projects.listing
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		push, fetchProjects
	}, dispatch)
}

const ConnectedProjectListing = connect(mapStateToProps, mapDispatchToProps)(ProjectListing)

export default ConnectedProjectListing