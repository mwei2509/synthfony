import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'

class Topbar extends Component {
	render() {
		let { loggedIn } = this.props;
		return (
			<div className={`Topbar`}>
				{loggedIn ? 
					<Link to={'/dashboard'}>Dashboard</Link> :
					<Link to={'/register'}>Register</Link>
				}
				<Link to={'/'}>Home</Link>
				<Link to={'/create'}>Create a motif</Link>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		loggedIn: state.account.loggedIn
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({ push }, dispatch)
}

const ConnectedTopbar = connect(mapStateToProps, mapDispatchToProps)(Topbar)

export default ConnectedTopbar