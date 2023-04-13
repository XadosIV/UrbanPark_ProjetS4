import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import events from "../data/events";

export function AgendaTest (){
	const localizer = momentLocalizer(moment);

	return (
		<div>
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				style={{height:500}}
			/>
		</div>
	)
}