import axios from "axios"

/**
 * getAllSpotsFilter
 * Renvoie une liste de spot selon les paramètres donnés
 *
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
	return axios.get(url).then((res) => res).catch(err => err.response)
}