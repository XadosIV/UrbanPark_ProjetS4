import axios from "axios"

/**
 * TakeAllSpotTypes
 * Returns a list of all spot types
 *
 * @return { Promise list of String }
 */
function TakeAllSpotTypes() {
	const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spot-types";
	return axios.get(url).then((res) => res.data);
}

export default { TakeAllSpotTypes }
