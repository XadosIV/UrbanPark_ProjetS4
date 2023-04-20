import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment";
import "moment/locale/fr"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { TakeAllEvents } from "../services";
import { UpdateScheduleForm } from "../components";

export function ViewAgenda (props){
	const localizer = momentLocalizer(moment);

	const [eventsList, setEventsList] = useState([]);

	function FormatSchedule (list)
	{
		let sortie = []
		let i = 0;
		list.forEach(element => {
			let role = element.role;
			let idParking = element.parking;
			let parking = element.name;
			let user = element.last_name;
			let dateStart = element.date_start;
			let dateEnd = element.date_end;

			let startTitle = "";

			if (role == "Gardien"){
				startTitle = "Gardiennage ";
			}
			else {
				startTitle = "Nettoyage parking ";
			}

			let trouve = false;
			let utile = true;

			function MemeParking(idParking, elem)
			{
				return elem.idparking === idParking;
			}
			function MemeDepart(dateStart, elem)
			{
				return  elem.d_st === dateStart;
			}
			function MemeFin(dateEnd, elem)
			{
				return  elem.d_en === dateEnd;
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
					title: startTitle + " du parking " + parking + " par " + user,
					start: new Date(dateStart),
					d_st: dateStart,
					d_en: dateEnd,
					end: new Date(dateEnd),
					user: element.id,
					first_spot:element.first_spot,
					last_spot:element.last_spot
				};
				sortie.push(newElement);
			}
			i++;
		});
		return sortie;
	}

	useEffect(() => {
		let role = null;
		let id = 0;

		if (props.props)
		{
			if (props.props.user)
			{
				id = props.props.user;
			}
			if (props.props.role)
			{
				role = props.props.role;
			}
		}
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

	const [selectedEvent, setSelectedEvent] = useState(undefined)
	const [modalState, setModalState] = useState(false)
	const handleSelectedEvent = (event) => {
		setSelectedEvent(event)
		setModalState(!modalState)
	}

	const ButtonUpdateSchedule = () => {
		console.log(selectedEvent)
		return (
		    <div className={`modal-${modalState == true ? 'show' : 'hide'}`}>
				<UpdateScheduleForm event={selectedEvent}/>
		    </div>
		)
	}

	return (
		<div>
			<Calendar
				localizer={localizer}
				events={eventsList}
				startAccessor="start"
				endAccessor="end"
				onSelectEvent={(e) => handleSelectedEvent(e)}
				style={{height:500, width:600}}
				culture="fr"
				messages={messages}
			/>
			{selectedEvent && <ButtonUpdateSchedule />}
		</div>
	)
}