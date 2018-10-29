import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom'
import CreateEditTrack from './Stories/CreateEditTrack'
import ReadOnlyEditTrack from './Stories/ReadOnlyEditTrack'
import CollabTrack from './Stories/CollabTrack'
import Homepage from './Stories/Homepage'
import Session from './Account/Session'
import Dashboard from './Account/Dashboard'

const Authorization = (allowed, status) => (WrappedComponent) => {
	return class WithAuthorization extends Component {
		render() {
			if (allowed.includes(status)) {
				return <WrappedComponent {...this.props} />
			} else {
				return <h1>You must be logged in to do that</h1>
			}
		}
	}
}

class RouteHandler extends Component {
	// shouldComponentUpdate(nextProps) {
	// 	return this.props.location.pathname !== nextProps.location.pathname
	// }
	render() {
		let { loggedIn } = this.props
		let LoggedIn = Authorization([true], loggedIn)
		return (
			<div className='RouteHandler'>
				<Switch>
					<Route path='/register' component={Session} />
					<Route path='/login' component={Session} />
					<Route path='/collab/:room' component={LoggedIn(CollabTrack)} />
					<Route path='/create' component={LoggedIn(CreateEditTrack)} />
					<Route path='/dashboard' component={Dashboard} />
					<Route path='/u/:username/:track_slug/edit' component={LoggedIn(CreateEditTrack)} />
					<Route path='/u/:username/:track_slug' component={ReadOnlyEditTrack} />
					<Route path='/' component={Homepage} />
				</Switch>
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
	return bindActionCreators({
	}, dispatch)
}

const ConnectedRouteHandler = connect(mapStateToProps, mapDispatchToProps)(RouteHandler)

export default ConnectedRouteHandler
