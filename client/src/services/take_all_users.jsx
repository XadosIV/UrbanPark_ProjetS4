import axios from "axios"

function TakeAllUsers(){
	const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users";
	return axios.get(url).then((res) => res.data)
}

export default { TakeAllUsers };