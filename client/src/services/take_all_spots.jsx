import axios from "axios"

/**
 * TakeAllSpots
 * Returns a list of spots corresponding to the id of the parking given in parameter (If no id, get all spots)
 *
 * @param { integer } id_park
 * @param { integer } floor
 * @param { String } type
 * @return { Promise list of User }
 */
function TakeAllSpots(id_park=0, floor=-1){
    const obj = {id_park: id_park}
    const flo = {floor: floor}
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spots"
    if (id_park !== 0) {
        url = url + "?" + new URLSearchParams(obj).toString();
    }
    if (floor !== -1) {
        url = url + "&" + new URLSearchParams(flo).toString();
    }
	return axios.get(url).then((res) => res.data)
}

export default { TakeAllSpots };