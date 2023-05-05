import axios from "axios"

/**
 * getAllSpotsTyped
 * Returns a list of spots with the 'abonné' type corresponding to the id of the parking given in parameter (If no id, get all spots)
 *
 * @param { Char } id_park
 * @param { string } type
 * @return { Promise list of User }
 */
export async function getAllSpotsTyped(id_park=0, type=0, etage=0){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spots"
    if(id_park !== 0) {
        const id = {id_park: id_park}
        url += "?" + new URLSearchParams(id).toString();
    }
    if(type !== 0){
        const typed = {type: type};
        if(id_park !== 0){
            url += "&";
        }else{
            url += "?";
        }
        url += new URLSearchParams(typed).toString();
    }
    if(etage !== 0){
        const floor = {floor: etage};
        if(id_park === 0 && type === 0){
            url += "?";
        }else{
            url += "&";
        }
        url += new URLSearchParams(floor).toString();
    }
    console.log("url getAllSpotsTyped", url);
	return axios.get(url).then((res) => res).catch(err => err.response)
}