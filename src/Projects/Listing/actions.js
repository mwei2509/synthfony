import api from '../../api'
import { batchActions } from 'redux-batched-actions';
import { getTimeInMs } from '../../utils/functions'

export const fetchProjects = (type) => {
	return (dispatch) => {
		let endpoint = ((t) => {
			switch(t) {
				case 'homepage': return '/projects';
				case 'dashboard': return '/current_user_projects'
			}
		})(type)

		api.get(endpoint)
		.then(({data}) => {
			let updateListing = {
				type: 'UPDATE_LISTING',
				payload: {
					info: {
						type: type,
						lastUpdated: getTimeInMs()
					},
					projects: data.data
				}
			}
			dispatch(batchActions([updateListing]))
		})
		.catch((err) => { debugger; })
	}
}