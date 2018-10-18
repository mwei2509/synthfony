import React, { Component } from 'react';
import './style.css';

export default class Notifications extends Component {
	constructor() {
		super()
	}
	
	showNotifications(notifications) {
		return notifications.map((notification) => {
			return <div className="notification">{notification}</div>
		})
	}

	render() {
		return (
			<div className='Notifications'>
				{this.showNotifications(this.props.notifications)}
			</div>
		);
	}
}