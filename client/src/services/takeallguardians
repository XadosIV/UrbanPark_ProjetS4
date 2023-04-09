import axios from "axios"

function TakeAllGuardians(){
	const url = process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/guardians";
	return axios.post(url).then(res => console.log(res))
}

export default {
    TakeAllGuardians
};