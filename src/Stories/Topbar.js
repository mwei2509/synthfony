import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import AccountTopbar from '../Account/AccountTopbar'

export default class Topbar extends Component {
	render() {
		return (
			<div className={`Topbar`}>
				<AccountTopbar />
				<Link to={'/'}>Home</Link>
				<Link to={'/create'}>Create a motif</Link>
			</div>
		);
	}
}