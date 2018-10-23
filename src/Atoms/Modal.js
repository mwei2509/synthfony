import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Modal extends Component {
	constructor() {
		super();
		this.state = {
			openModal: false
		};
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
	}

	open(e) {
		let { onOpen } = this.props;
		e.stopPropagation();
		this.setState({
			openModal: true
		})
		if (typeof onOpen === 'function') {
			onOpen();
		}
	}

	close() {
		this.setState({
			openModal: false
		});
	}
	renderButton() {
		let { button, icon } = this.props;
		if (button) {
			return button;
		}
		if (icon) {
			return <FontAwesomeIcon icon={icon} />
		}
		return <FontAwesomeIcon icon="plus" />
	}
	renderToggleModal() {
		return <span className="icon" onClick={this.open}>
			{this.renderButton()}
		</span>
	}
	renderModal() {
		let { 
			suppressModal,
			customCss,
			children,
			modalWrapperStyle,
			innerModalStyle,
			modalWrapperClassNames,
			innerModalClassNames
		 } = this.props;
		if (suppressModal) {
			return null;
		}
		if (this.state.openModal) {
			if (customCss) {
				return children
			}
			modalWrapperStyle = modalWrapperStyle || {};
			innerModalStyle = innerModalStyle || {};
			modalWrapperClassNames = modalWrapperClassNames || '';
			innerModalClassNames = innerModalClassNames || '';
			return (
				<div className={`modal-wrapper ${modalWrapperClassNames}`} style={modalWrapperStyle}>
					<div className={`inner-modal ${innerModalClassNames}`} style={innerModalStyle}>
						<span className="icon" onClick={this.close}><FontAwesomeIcon icon="times" /></span>
						{children}
					</div>
				</div>
			)
		}
		return null;
	}
	
	render() {
		return (
			<div className="Modal">
				{this.renderToggleModal()}
				{this.renderModal()}
			</div>
		)
	}
}