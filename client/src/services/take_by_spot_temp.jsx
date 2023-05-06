import axios from "axios"

/**
 * TakeBySpot
 * Returns a user corresponding to the id of the spot temp given in parameter
 *
 * @param { integer } id_spot_temp
 * @return { User }
 */
async function TakeBySpotTemp(id_spot_temp){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users?id_spot_temp=" + id_spot_temp
	return axios.get(url).then((res) => res.data)
}

export default { TakeBySpotTemp };