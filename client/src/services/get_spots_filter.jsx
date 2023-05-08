import axios from "axios"

/**
 * getAllSpotsTyped
 * Returns a list of spots with the 'abonné' type corresponding to the id of the parking given in parameter (If no id, get all spots)
 *
 * @param { Char } id_park
 * @param { Array } params
 * @return { Promise list of User }
 */
export async function getAllSpotsFilter(params=[]){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spots"
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        url += (i===0) ? "?" : "&";
        url += new URLSearchParams(param).toString();
    }
    //console.log("url getAllSpotsTyped", url);
	return axios.get(url).then((res) => res).catch(err => err.response)
}