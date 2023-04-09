import axios from "axios"

function authenticate(user){
	const url = process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "?email=" + user.identifier + "&mdp=" + user.password;
	console.log(url)
	return axios.post(url)
	.then(res => console.log(res))
}

export default {
	authenticate
};