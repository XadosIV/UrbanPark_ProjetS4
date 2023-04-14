import axios from "axios"

/**
 * TakeByRole
 * Returns a list of users corresponding to the role given in parameter (If no role, get all users)
 *
 * @param { String } role
 * @return { Promise list of User }
 */
async function TakeByRole(role=""){
    const obj = {role: role}
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users"
    if (role !== "") {
        url = url + "?" + new URLSearchParams(obj).toString();
    }
	return axios.get(url).then((res) => res.data)
}

export default { TakeByRole };