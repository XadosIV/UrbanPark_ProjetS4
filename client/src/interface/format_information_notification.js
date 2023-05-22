export function FormatInformationNotification (action, infos) {
	let final = {action:action, id:infos.id_notification, type:infos.type, users:[], horaire:[], parking:null, etages:null}
	for (let user of infos.guests) {
		final.users.push(user.last_name + " " + user.first_name);
	}
	for (let user of infos.users) {
		final.users.push(user.last_name + " " + user.first_name);
	}
	if (infos.date_start) {
		final.horaire.push(new Date(infos.date_start));
		final.horaire.push(new Date(infos.date_end));
	}
	if (infos.parking) {
		final.parking=infos.parking.name;
	}
	if (infos.spots) {
		let spots = infos.spots;
		let nListe = []
		for (let spot of spots) {
			let floor = spot.floor
			if (Array.isArray(nListe[spot.floor])) {
				nListe[floor].push(spot);
			} else {
				nListe.push([spot]);
			}
		}
		final.etages=nListe;
	}
	return final;
}