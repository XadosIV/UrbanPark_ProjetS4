import axios from "axios"

function TakeAllUsers(){
	const url = process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/users";
	return axios.get(url).then((res) => res.data)
}

export default {
	TakeAllUsers
};