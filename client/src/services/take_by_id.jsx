import axios from "axios";

/**
 * TakeByRole
 * Returns a list of users corresponding to the role given in parameter (If no role, get all users)
 *
 * @param { Int } role
 * @return { Promise User }
 */
async function TakeById(id){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users/"+String(id)
	return axios.get(url).then((res) => res.data)
}

export default { TakeById };