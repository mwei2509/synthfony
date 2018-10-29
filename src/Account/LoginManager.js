import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'

import { clearUser, logout, refreshUser } from './actions' // session actions

class LoginManager extends Component {

	componentDidMount(){
		let { token, refreshUser } = this.props;
		if (token) {
			refreshUser(token);
		}
	}

	shouldComponentUpdate(nextProps) {
		let locationChanged = nextProps.location.pathname !== this.props.location.pathname;
		let loginStatusChanged = nextProps.loggedIn !== this.props.loggedIn
		return locationChanged || loginStatusChanged;
	}

	render() {
		return this.props.children.map((child) => {
			return React.cloneElement(child, {...this.props})
		});
	}
}

const mapStateToProps = (state) => {
	return ({
		loggedIn: state.account.loggedIn,
		token: state.account.token
	})
}
	
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		push, clearUser, logout, refreshUser // session actions
	}, dispatch)
}

const ConnectedLoginManager = connect(mapStateToProps, mapDispatchToProps)(LoginManager)

export default ConnectedLoginManager
