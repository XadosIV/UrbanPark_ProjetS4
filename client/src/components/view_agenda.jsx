import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment";
import "moment/locale/fr"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { TakeAllEvents } from "../services";
import take_parking from "../services/take_parking";

export function AgendaTest (props){
	console.log(props)
	const role = props.props.role;
	const id = props.props.user;
	console.log(id)

	const localizer = momentLocalizer(moment);

	const [eventsList, setEventsList] = useState([]);

	function FormatSchedule (list)
	{
		let sortie = []
		let i = 0;
		list.forEach(element => {
			let idUser = element.user
			let idParking = element.parking;
			let parking = element.name;
			let user = element.last_name;
			let dateStart = element.date_start;
			let dateEnd = element.date_end;
			
			let trouve = false
			let utile = true;

			function MemeParking(idParking, elem)
			{
				return elem.idparking == idParking;
			}
			function MemeDepart(dateStart, elem)
			{
				return  elem.d_st == dateStart;
			}
			function MemeFin(dateEnd, elem)
			{
				return  elem.d_en == dateEnd;
			}

			let j = 0;

			while (j < sortie.length && !trouve)
			{
				if (MemeParking(idParking, sortie[j]) && MemeDepart(dateStart, sortie[j]) && MemeFin(dateEnd, sortie[j]))
				{
					trouve = true;
					sortie[j].title += " and " + user;
				}
				j++;
			}
			if (!trouve)
			{
					
				let newElement = {
					id: i,
					idparking: idParking,
					title: "nettoyage parking " + parking + " by " + user,
					start: new Date(dateStart),
					d_st: dateStart,
					d_en: dateEnd,
					end: new Date(dateEnd),
				};
				sortie.push(newElement);
			}
			i++;
		});
		return sortie;
	}

	useEffect(() => {
		TakeAllEvents(id, role).then(res => {
			setEventsList(FormatSchedule(res));
		})
	}, []);

	const messages = {
		allDays: "Tous les jours",
		previous: "Précédent",
		next: "Suivant",
		today: "Aujourd'hui",
		month: "Mois",
		week: "Semaine",
		day: "Jour",
		agenda: "Agenda",
		date:"Date",
		time: "Heure",
		event: "Evenement",
	};

	return (
		<div>
			<Calendar
				localizer={localizer}
				events={eventsList}
				startAccessor="start"
				endAccessor="end"
				style={{height:500, width:700}}
				culture="fr"
				messages={messages}
			/>
		</div>
	)
}