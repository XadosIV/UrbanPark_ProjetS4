import axios from "axios"
import { FormatNotification } from "../interface";

/**
 * getNotificationId
 * Renvoie le schedule ayant l'id donné
 *
 * @param { int } id
 * @return { Promise Schedule }
 */
export function getNotificationId(id){
    if(id){
        var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/notifications?id_user=" + id;
		return axios.get(url).then((res) => {
			return FormatNotification(res.data);
		}).catch(err => err.response)
    }
	return null;
}