import axios from "axios";

async function authenticate(user) {
	const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/auth?email=" + user.identifier + "&password=" + user.password;
	// console.log(url);
	return axios.get(url).then((res) => res).catch((err) => err.response);
}

export {
	authenticate
};