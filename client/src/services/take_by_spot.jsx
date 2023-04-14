import axios from "axios"

/**
 * TakeBySpot
 * Returns a user corresponding to the id of the spot given in parameter
 *
 * @param { integer } id_spot
 * @return { User }
 */
async function TakeBySpot(id_spot){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users?id_spot=" + id_spot
	return axios.get(url).then((res) => res.data)
}

export default { TakeBySpot };