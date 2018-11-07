import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { logout } from './actions';
import { push } from 'react-router-redux'
import ProjectListing from '../Projects/Listing/ProjectListing';

class AccountTopbar extends Component {
	constructor() {
		super();
		this.logout = this.logout.bind(this)
	}
	logout() {
		this.props.logout();
		this.props.push('/');
	}
	getLoggedIn() {
		return <div className="AccountTopbar logged-in">
			<Link to={'/dashbaord'}>Dashboard</Link>
			<span className="nav-link" onClick={this.logout}>Logout</span>
		</div>
	}
	render() {
		if (this.props.loggedIn) {
			return this.getLoggedIn()
		}
		return (
			<div className="AccountTopbar">
				<Link to={'/register'}>Register</Link>
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

const ConnectedAccountTopbar = connect(mapStateToProps, mapDispatchToProps)(AccountTopbar)

export default ConnectedAccountTopbar