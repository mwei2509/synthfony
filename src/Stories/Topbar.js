import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'

class Topbar extends Component {
	render() {
		return (
			<div className={`Topbar`}>
				<Link to={'/register'}>Register</Link>
				<Link to={'/'}>Home</Link>
				<Link to={'/create'}>Create a motif</Link>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({ push }, dispatch)
}

const ConnectedTopbar = connect(mapStateToProps, mapDispatchToProps)(Topbar)

export default ConnectedTopbar