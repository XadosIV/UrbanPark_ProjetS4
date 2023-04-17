import axios from "axios"

/**
 * TakeSchedule
 * Returns a list of schedule
 *
 * @return { Promise list of Schedule }
 */
async function TakeAllEvents(){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/schedules"
	return axios.get(url).then((res) => res.data)
}

export {
	TakeAllEvents
}