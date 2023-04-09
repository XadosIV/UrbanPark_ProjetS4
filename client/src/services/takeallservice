import axios from "axios"

function TakeAllService(){
	const url = process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/service";
	return axios.post(url).then(res => console.log(res))
}

export default {
    TakeAllService
};