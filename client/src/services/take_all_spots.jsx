import axios from "axios"

/**
 * TakeAllSpots
 * Returns a list of spots corresponding to the id of the parking given in parameter (If no id, get all spots)
 *
 * @param { integer } id_park
 * @param { integer } id
 * @return { Promise list of User }
 */
async function TakeAllSpots(id_park=0, id=0){
    const id_p = {id_park: id_park}
    const id_s = {id: id}
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spots"
    if (id_park !== 0) {
        url += "?" + new URLSearchParams(id_p).toString()
        if (id !== 0) {
            url += "&" + new URLSearchParams(id_s).toString()
        }
    } else if (id !== 0) {
        url += "?" + new URLSearchParams(id_s).toString()
    }
	return axios.get(url).then((res) => res.data)
}

export default { TakeAllSpots };