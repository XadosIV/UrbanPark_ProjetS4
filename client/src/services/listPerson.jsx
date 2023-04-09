import axios from "axios"

function takeAll(){
	const url = process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/users";
	console.log(url)
	return axios.post(url)
	.then(res => console.log(res))
}

export default {
	takeAll
};