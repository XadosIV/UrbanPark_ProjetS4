import axios from "axios"

/**
 * getScheduleId
 * Renvoie le schedule ayant l'id donné
 *
 * @param { int } id
 * @return { Promise Schedule }
 */
export async function getScheduleId(id){
    if(id){
        var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/schedules/" + id;
		return axios.get(url).then((res) => res).catch(err => err.response)
    }
	return null;
}