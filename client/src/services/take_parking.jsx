import axios from "axios"

/**
 * TakeParking
 * Returns a list of parkings corresponding to the name given in parameter (If no name, get all parkings)
 *
 * @param { String } name
 * @return { Promise list of Parking }
 */
function TakeParking(name=""){
    const obj = {name: name}
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/parkings"
    if (name != "") {
        url = url + "?" + new URLSearchParams(obj).toString();
    }
	return axios.get(url).then((res) => res.data)
}

export default { TakeParking };