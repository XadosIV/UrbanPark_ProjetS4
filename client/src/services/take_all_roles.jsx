import axios from "axios"

/**
 * TakeAllRoles
 * Returns a list of roles 
 *
 * @return { Promise list of User }
 */
async function TakeAllRoles(){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/role"
	return axios.get(url).then((res) => res.data)
}

export { TakeAllRoles };