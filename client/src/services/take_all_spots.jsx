import axios from "axios"

/**
 * TakeAllSpots
 * Returns a list of spots corresponding to the id of the parking given in parameter (If no id, get all spots)
 *
 * @param { integer } id_park
 * @param { integer } floor
 * @return { Promise list of User }
 */
function TakeAllSpots(id_park=0, floor="%", number=""){
    const obj = {id_park: id_park}
    const flo = {floor: floor}
    const nb = {number: number}
    console.log(typeof(number))
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spots"
    if (id_park !== 0) {
        url = url + "?" + new URLSearchParams(obj).toString()
    }
    if (floor !== "%") {
        url = url + "&" + new URLSearchParams(flo).toString()
    }
    if (number !== "") {
        url = url + "&" + new URLSearchParams(nb).toString()
    }
	return axios.get(url).then((res) => res.data)
}

export default { TakeAllSpots };