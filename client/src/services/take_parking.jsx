import axios from "axios"

/**
 * TakeParking
 * Returns a list of parkings corresponding to the name given in parameter (If no name, get all parkings)
 *
 * @param { String } name
 * @return { Promise list of Parking }
 */
async function TakeParking(id=""){
    const obj = {id: id}
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/parkings"
    if (id !== "") {
        url = url + "?" + new URLSearchParams(obj).toString();
    }
	return axios.get(url).then((res) => res.data)
}

export default { TakeParking };