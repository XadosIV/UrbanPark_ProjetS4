import axios from "axios"

function TakeAllSpotTypes() {
	const url = process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/spottypes";
	return axios.get(url).then((res) => res.data);
}

export default { TakeAllSpotTypes }
