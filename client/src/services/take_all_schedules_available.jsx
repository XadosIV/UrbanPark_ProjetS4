import axios from "axios"

/**
 * TakeAllSchedulesAvailable
 * Returns a list of array [date_start, date_end] with all the moments everyone is available between 2 dates
 *
 * @param { JSON } infos - roles[], users[], date_start, date_end
 * @return { Promise list of User }
 */
async function TakeAllSchedulesAvailable(infos){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/reunion"
    //console.log(JSON.stringify(infos));
	return axios.get(url, {params: infos}).then((res) => res.data)
}

export { TakeAllSchedulesAvailable };