import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { register, login } from './actions';
import { push } from 'react-router-redux'

class Session extends Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			email: ''
		}
	}
	checkLogin() {
		if (this.props.loggedIn) {
			this.props.push('/dashboard');
		}
	}
	componentDidMount() {
		this.checkLogin();
	}
	componentDidUpdate() {
		this.checkLogin();
	}
	getInput(field) {
		return <div>
				<label>{field}</label>
				<input
					onChange={(e) => { this.setState({ [field]: e.target.value }); }}
					value={this.state[field]} 
					/>
			</div>
	}
	getRegistration() {
		let { register, push } = this.props;
		return (
			<div className="Session">
				<h1>Register</h1>
				{this.getInput('username')}
				{this.getInput('email')}
				{this.getInput('password')}
				<button onClick={()=>{ register(this.state) }}>Register</button>
				<div>
					Have an account?  <button onClick={()=>{ push('/login') }}>Login</button>
				</div>
			</div>
		);
	}
	getLogin() {
		let { login, push } = this.props;
		return (
			<div className="Session">
				<h1>Login</h1>
				{this.getInput('email')}
				{this.getInput('password')}
				<button onClick={()=>{ login(this.state) }}>Login</button>
				<div>
					No account?  <button onClick={()=>{ push('/register') }}>Register</button>
				</div>
			</div>
		);
	}
	render() {
		let { pathname } = this.props.location;
		if (pathname === '/register') {
			return this.getRegistration();
		} else if (pathname === '/login') {
			return this.getLogin();
		}
		return null;
	}
}
const mapStateToProps = (state) => {
	return ({
		loggedIn: state.account.loggedIn
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		register, login, push
	}, dispatch)
}

const ConnectedSession = connect(mapStateToProps, mapDispatchToProps)(Session)

export default ConnectedSession