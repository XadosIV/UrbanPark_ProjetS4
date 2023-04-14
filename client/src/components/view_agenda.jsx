import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment";
import "moment/locale/fr"
import "react-big-calendar/lib/css/react-big-calendar.css"
import events from "../data/events";

export function AgendaTest (){
	const localizer = momentLocalizer(moment);

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
				events={events}
				startAccessor="start"
				endAccessor="end"
				style={{height:500}}
				culture="fr"
				messages={messages}
			/>
		</div>
	)
}