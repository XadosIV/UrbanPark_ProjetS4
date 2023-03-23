import axios from "axios"

function authenticate(user){
	const url = "localhost:3001?email=" + user.identifier + "&mdp=" + user.password;
	console.log(url)
	return axios.post(url)
	.then(res => console.log(res))
}

export default {
	authenticate
};