import axios from "axios"

/**
 * getAllSpotsTyped
 * Returns a list of spots with the 'abonné' type corresponding to the id of the parking given in parameter (If no id, get all spots)
 *
 * @param { Char } id_park
 * @param { Array } params
 * @return { Promise list of User }
 */
export async function getAllSpotsFilter(id_park=0, params=[]){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spots"
    if(id_park !== 0) {
        const id = {id_park: id_park}
        url += "?" + new URLSearchParams(id).toString();
    }
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        url += (i===0 && id_park===0) ? "?" : "&";
        url += new URLSearchParams(param).toString();
    }
    console.log("url getAllSpotsTyped", url);
	return axios.get(url).then((res) => res).catch(err => err.response)
}