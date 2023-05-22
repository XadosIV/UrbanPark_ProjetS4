import { getScheduleId } from "../services";
import { FormatInformationNotification } from "./";

/**
 * FormatNotification
 * function that convert information to notifications
 * 
 * @param {*} infos 
 * @returns [{*}] notifications
 */
export async function FormatNotification (infos) {
	let final = [];
	if (!Array.isArray(infos)) {
		infos = [infos];
	}
	for (let notification of infos) {
		final.push(FormatInformationNotification(notification.action, await getScheduleId(notification.id_schedule).then(res=>{
			res.data.id_notification = notification.id;
			return res.data
		})));
	}
	return final;
}