import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logout } from './actions';
import { push } from 'react-router-redux'
import ProjectListing from '../Projects/Listing/ProjectListing';

class Dashboard extends Component {
	constructor() {
		super();
		this.logout = this.logout.bind(this)
	}
	checkLogin() {
		if (!this.props.loggedIn) {
			this.props.push('/register');
		}
	}
	logout() {
		this.props.logout();
		this.props.push('/');
	}
	componentDidMount() {
		this.checkLogin();
	}
	componentDidUpdate() {
		this.checkLogin();
	}
	render() {
		return (
			<div className="Dashboard">
				{JSON.stringify(this.props.account)}
				<button onClick={this.logout}>logout</button>
				<button onClick={()=>{ this.props.push('/create'); }}>create new motif</button>
				<ProjectListing type="dashboard" />
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return ({
		loggedIn: state.account.loggedIn,
		account: state.account
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		push, logout
	}, dispatch)
}

const ConnectedDashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard)

export default ConnectedDashboard