/**
	 * BaseParking
	 * Returns a string corresponding to the base parking
	 *
	 * @param { integer } id_park - id of the parking
	 * @param { Array } list - List of parkings
	 * @return { string }
	 */
	export function BaseParking(id_park, list) {
		for (let parking of list) {
			if (parking.id === id_park) {
				return "Parking " + parking.name.toLowerCase();
			}
		}
	}