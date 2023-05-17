import axios from "axios"
import { FormatNotification } from "../interface";

/**
 * GetNotificationId
 * Renvoie le schedule ayant l'id donné
 *
 * @param { int } id
 * @return { Promise Schedule }
 */
export async function GetNotificationId(id){
    if(id){
        var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/notifications?id_user=" + id;
		//console.log("url GetNotificationId", url);
		return axios.get(url).then((res) => {
			// console.log("data", FormatNotification(res.data))
			return FormatNotification(res.data);
		}).catch(err => err.response)
    }
	return null;
}