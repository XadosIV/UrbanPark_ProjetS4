import axios from "axios";

/**
 * TakeById
 * Returns a user corresponding to the id given in parameter (If no id, get all users)
 *
 * @param { Int } id
 * @return { Promise User }
 */
async function takeById(id){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users/"+String(id)
	return axios.get(url).then((res) => res.data)
}

export { takeById };