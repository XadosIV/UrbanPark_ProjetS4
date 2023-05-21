import axios from "axios"

/**
 * TakeSchedule
 * Returns a list of schedule
 *
 * @return { Promise list of Schedule }
 */
async function TakeAllEvents(user =0, role = null){
	var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/schedules";
	let hasParams = {}
	if (user !== 0) {
		hasParams.users = user;
	}
	if (role !== null) {
		hasParams.roles = [role];
	}
	return axios.get(url, {params:hasParams}).then((res) => res.data)
}

export {
	TakeAllEvents
}