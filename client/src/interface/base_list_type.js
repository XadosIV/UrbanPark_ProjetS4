import { AllServices } from "./";
import { TakeByRole } from "../services";

/**
	 * BaseListType
	 * Returns a array corresponding to the list of users corresponding to the type
	 *
	 * @param { string } spot - Type of the schedule
	 * @return { Array }
	 */
	export function BaseListType(type, guardiansList, serviceList) {
		if (type == "Gardiennage") {
			return AllServices(guardiansList);
		} else if (type == "Nettoyage") {
			return AllServices(serviceList);
		} else if (type == "Réunion") {
			return AllServices(serviceList).concat(AllServices(guardiansList));
		}
	}