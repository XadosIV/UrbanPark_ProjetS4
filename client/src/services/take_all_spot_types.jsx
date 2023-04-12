import axios from "axios"

/**
 * TakeAllSpotTypes
 * Returns a list of spot types corresponding to the id of the spot given in parameter (If no id, get all spots types)
 *
 * @param { integer } id_spot
 * @return { Promise list of User }
 */
function TakeAllSpotTypes(id_spot=0){
    const obj = {id_spot: id_spot}
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spot-types"
    if (id_spot !== 0) {
        url = url + "?" + new URLSearchParams(obj).toString();
    }
	return axios.get(url).then((res) => res.data)
}

export default { TakeAllSpotTypes };