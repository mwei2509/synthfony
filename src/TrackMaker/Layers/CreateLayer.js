import React, { Component } from 'react';
import CreateLayerModal from './CreateLayerModal'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addMeasure } from '../Measures/actions'
import { addPlayerToNewLayer } from './actions'
import { isObject } from '../../utils/functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '../../Atoms/Modal';

class CreateLayer extends Component {
	constructor() {
		super();
		this.initLayer = this.initLayer.bind(this);
		this.modal = React.createRef();
	}

	initLayer(player) {
		let { addPlayerToNewLayer, addMeasure } = this.props;
		addPlayerToNewLayer(player);
		this.modal.current.close();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.shouldAddNewMeasure(prevProps, this.props)) {
			this.addNewMeasure();
		}
	}
	shouldAddNewMeasure(prevProps, thisProps) {
		return prevProps.currentLayer !== thisProps.currentLayer && 
			isObject(thisProps.currentLayer) && 
			thisProps.currentLayer.measure_ids.length === 0 &&
			this.isFromCurrentUser(thisProps);
	}
	isFromCurrentUser(thisProps) {
		return !thisProps.currentLayer.userId || /* current layer has no userId, e.g. is from me */
			!thisProps.currentUser || /* no current layer = solo proj */
			(thisProps.currentLayer.userId === thisProps.currentUser); /* current layer has my user id */
	}
	addNewMeasure() {
		let { currentLayer, addMeasure } = this.props;
		addMeasure(currentLayer);
	}
	renderToggleModal() {
		if (this.props.isIntro) {
			return (
				<div className="create-layer-intro">
					<h1>Click to add a layer (or click the + in the sidebar)</h1>
				</div>
			)
		}
		return this.renderSidebarModal();
	}
	renderSidebarModal() {
		return (
			<span>
				<FontAwesomeIcon icon="plus" />
				{this.props.expanded ? <span className="sidebar-label">Create Layer</span> : null}
			</span>
		)
	}
	
	render() {
		return (
			<div className="CreateLayer">
				<Modal
					ref={this.modal}
					button={this.renderToggleModal()}
					customCss={false}
					>
					<CreateLayerModal initLayer={this.initLayer} />
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	let currentLayerId = state.track.currentSelection.currentLayer;
	let currentLayer = currentLayerId ? state.track.layers[currentLayerId] : null;
	return ({
		currentLayer: currentLayer,
		currentUser: state.connection.userId
	})
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		addPlayerToNewLayer, addMeasure
	}, dispatch)
}

const ConnectedCreateLayer = connect(mapStateToProps, mapDispatchToProps)(CreateLayer)

export default ConnectedCreateLayer