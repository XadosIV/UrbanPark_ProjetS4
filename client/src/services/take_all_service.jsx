import axios from "axios"

function TakeAllService() {
	const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users?role=Agent%20d%27entretien";
	return axios.get(url).then((res) => res.data);
}

export default { TakeAllService };