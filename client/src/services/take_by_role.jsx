import axios from "axios"

function TakeAll(role=""){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users"
    if (role != "") {
        url = url + "?role=" + role;
    }
	return axios.get(url).then((res) => res.data)
}

export default { TakeAll };