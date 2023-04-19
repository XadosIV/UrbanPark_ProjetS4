import axios from "axios"

/**
 * TakeSchedule
 * Returns a list of schedule
 *
 * @return { Promise list of Schedule }
 */
async function TakeAllEvents(user =0, role = null){
	console.log(user)
	var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/schedules"
	if (user !== 0) {
		const obj = {user: user}
        url = url + "?" + new URLSearchParams(obj).toString();
		if (role !== null) {
			const obj = {user: user}
			url = url + "&" + new URLSearchParams(obj).toString();
		}
    }
	else if (role !== null) {
		const obj = {user: user}
		url = url + "?" + new URLSearchParams(obj).toString();
	}
	console.log(url)
	return axios.get(url).then((res) => res.data)
}

export {
	TakeAllEvents
}