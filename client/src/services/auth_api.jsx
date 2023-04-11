import axios from "axios"

async function authenticate(user) {
	const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/auth?email=" + user.identifier + "&password=" + user.password;
	console.log(url);
	try {
		const res = await axios.get(url);
		return res.data;
	} catch (err) {
		return err.response;
	}
}

export {
	authenticate
};