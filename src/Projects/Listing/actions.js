import api from '../../api'
import { batchActions } from 'redux-batched-actions';

export const fetchProjects = (type) => {
	return (dispatch) => {
		if (type === 'homepage') {
			api.get(`/projects`)
				.then(({data}) => {
					let updateListing = {
						type: 'UPDATE_LISTING',
						payload: {							
							info: {
								type: type
							},
							projects: data.data
						}
					}
					dispatch(batchActions([updateListing]))
				})
				.catch((err) => { debugger; })
		}
	}
}