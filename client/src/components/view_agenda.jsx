import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment";
import "moment/locale/fr"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { TakeAllEvents } from "../services";
import take_parking from "../services/take_parking";

export function AgendaTest (){
	const localizer = momentLocalizer(moment);

	const [eventsList, setEventsList] = useState([]);
	const [parkingsList, setParkingsList] = useState([]);

	function FormatSchedule (list)
	{
		let sortie = []
		let i = 0;
		list.forEach(element => {
			let idparking = element.parking;
			let user = element.user;
			let dateStart = element.date_start;
			let dateEnd = element.date_end;

			take_parking.TakeParking(idparking).then(res=> {

			// console.log(res)
				
			let newElement = {
				id: i,
				title: "nettoyage parking " + String(res[0].name) + " by " + String(user),
				start: new Date(dateStart),
				end: new Date(dateEnd),
			  };
			sortie.push(newElement);
			});
		});
		setEventsList(sortie);
		return sortie;
	}

	useEffect(() => {
		TakeAllEvents().then(res => {
			const list = FormatSchedule(res)
			setEventsList(list);
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
				style={{height:500}}
				culture="fr"
				messages={messages}
			/>
		</div>
	)
}