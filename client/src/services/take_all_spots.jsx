import axios from "axios"

/**
 * TakeAllSpots
 * Returns a list of spots corresponding to the id of the parking given in parameter (If no id, get all spots)
 *
 * @param { integer } id_park
 * @param { integer } floor
 * @return { Promise list of User }
 */
async function TakeAllSpots(id_park=0, floor="%", number=0){
    const id = {id_park: id_park}
    const fl = {floor: floor}
    const nb = {number: number}
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spots"
    if (id_park !== 0) {
        url += "?" + new URLSearchParams(id).toString()
    }
    if (floor !== "%") {
        url +=  "&" + new URLSearchParams(fl).toString()
    }
    if (number !== 0) {
        url += "&" + new URLSearchParams(nb).toString()
    }
	return axios.get(url).then((res) => res.data)
}

export default { TakeAllSpots };