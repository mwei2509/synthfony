import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './style.css';

class Notifications extends Component {
	constructor() {
		super()
	}
	
	showNotifications() {
		let { notifications } = this.props;
		if (notifications) {
			return notifications.map((notification) => {
				return <div className="notification">{notification.msg}</div>
			})
		}
		return null;
	}

	render() {
		return (
			<div className='Notifications'>
				{this.showNotifications()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return ({
		notifications: state.notifications
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({}, dispatch)
}

const ConnectedNotifications = connect(mapStateToProps, mapDispatchToProps)(Notifications)

export default ConnectedNotifications