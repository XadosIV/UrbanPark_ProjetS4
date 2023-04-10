import axios from "axios"

function TakeAllGuardians() {
	const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users?role=gardien";
	return axios.get(url).then((res) => res.data);
}

export default { TakeAllGuardians };