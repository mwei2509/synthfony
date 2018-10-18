import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import CreateEditTrack from './Stories/CreateEditTrack'
import CollabTrack from './Stories/CollabTrack'
// import CollabIntro from '../Wrapper/CollabIntro'
// import HomepageWrapper from '../Wrapper/HomepageWrapper'

export default class RouteHandler extends Component {
	render() {
		return (
			<div className='RouteHandler'>
				<Switch>
					<Route path='/collab/:room' component={CollabTrack} />
					<Route path='/' component={CreateEditTrack} />
				</Switch>
			</div>
		);
	}
}
