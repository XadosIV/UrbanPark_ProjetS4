import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment";
import "moment/locale/fr"
import "react-big-calendar/lib/css/react-big-calendar.css"
import events from "../data/events";
import { TakeAllEvents } from "../services";

export function AgendaTest (){
	const localizer = momentLocalizer(moment);

	const [eventsList, setEventsList] = useState([]);

	function FormatSchedule (list)
	{
		let res = []
		let i = 0;
		list.forEach(element => {
			let parking = element.parking;
			let user = element.user;
			let dateStart = element.date_start;
			let dateEnd = element.date_end;

			let newElement = {
				id: i,
				title: "nettoyage parking " + String(parking) + " by " + String(user),
				start: new Date(dateStart),
				end: new Date(dateEnd),
			  };
			res.push(newElement);
		});
		console.log(res);
		return res;
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