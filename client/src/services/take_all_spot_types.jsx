import axios from "axios"

function TakeAllSpotTypes() {
	const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spot-types";
	return axios.get(url).then((res) => res.data);
}

export default { TakeAllSpotTypes }
