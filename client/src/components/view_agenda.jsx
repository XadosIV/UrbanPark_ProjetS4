import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment";
import "moment/locale/fr"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { TakeAllEvents, TakeByRole } from "../services";
import { UpdateScheduleForm } from "../components";

export function ViewAgenda (props){
	const localizer = momentLocalizer(moment);

	const [eventsList, setEventsList] = useState([]);
	const [update, setUpdate] = useState(true)

	function Callback(childData) {
        setUpdate(childData)
    }

	function FormatSchedule (list)
	{
		let sortie = []
		let i = 0;
		list.forEach(element => {
			let type = element.type
			let role = element.role;
			let idParking = element.parking;
			let parking = element.name;
			let user = element.last_name;
			let dateStart = element.date_start;
			let dateEnd = element.date_end;

			let trouve = false;

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
					if (sortie[j].type !== "Réunion"){
						sortie[j].title += " and " + user;
					}
					if (!(sortie[j].user.find(user => element.user === user))) {
						sortie[j].user.push(element.user)
					}
					sortie[j].id_schedule.push(element.id)
				}
				j++;
			}
			if (!trouve)
			{
				let newElement = {
					id_schedule:[element.id],
					type : type,
					id: i,
					idparking: idParking,
					title: type !== "Réunion" ? type + " du parking " + parking + " par " + user : type,
					start: new Date(dateStart),
					d_st: dateStart,
					d_en: dateEnd,
					end: new Date(dateEnd),
					user: [element.user],
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
	}, [props.update, update]);

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
		setUpdate(true)
	}

	const [serviceList, setServiceList] = useState([]);
	const [guardiansList, setGuardiansList] = useState([]);

	function AllServices(list) {
		var opt = []
		for (let i=0; i<list.length; i++) {
			opt.push({value:list[i].id, label:list[i].first_name + " " + list[i].last_name})
		}
		return opt
	}

	/**
	 * BaseParking
	 * Returns a string corresponding to the base parking
	 *
	 * @param { integer } id_park - id of the parking
	 * @param { Array } list - List of parkings
	 * @return { string }
	 */
	function BaseParking(id_park, list) {
		for (let parking of list) {
			if (parking.id === id_park) {
				return "Parking " + parking.name.toLowerCase();
			}
		}
	}

	/**
	 * BaseListType
	 * Returns a array corresponding to the list of users corresponding to the type
	 *
	 * @param { string } spot - Type of the schedule
	 * @return { Array }
	 */
	function BaseListType(type) {
		if (type == "Gardiennage") {
			return AllServices(guardiansList);
		} else if (type == "Nettoyage") {
			return AllServices(serviceList);
		} else if (type == "Réunion") {
			return AllServices(serviceList).concat(AllServices(guardiansList));
		}
	}

	/**
	 * BaseUser
	 * Returns a array corresponding to the base user being passed in a react select defaultValue
	 *
	 * @param { integer } id_user - id of the user
	 * @param { Array } list - List of users
	 * @return { Array }
	 */
	function BaseUser(id_user, list) {
		list = BaseListType(list)
		var opts = []
		if (!Array.isArray(id_user)) {
			id_user = [id_user]
		}
		if (list) {
			for (let user of list) {
				for (let id of id_user) {
					if (user.value === id) {
						opts.push(user);
					}
				}
			}
			return opts
		}
	}

	/**
	 * BaseListType
	 * Returns a array corresponding to the list of users corresponding to the type
	 *
	 * @param { string } spot - Type of the schedule
	 * @return { Array }
	 */
	function BaseListType(type) {
		if (type == "Gardiennage") {
			return AllServices(guardiansList);
		} else if (type == "Nettoyage") {
			return AllServices(serviceList);
		} else if (type == "Réunion") {
			return AllServices(serviceList).concat(AllServices(guardiansList));
		}
	}

	/**
	 * AllServices
	 * Returns a lists of options for a Select React component composed of every type 
	 *
	 * @param { Array } list - List of service
	 * @return { Array }
	 */
	function AllServices(list) {
		if (!Array.isArray(list)) {
			list = [list]
		}
		var opt = []
		for (let i=0; i<list.length; i++) {
			opt.push({value:list[i].id, label:list[i].first_name + " " + list[i].last_name})
		}
		return opt
	}


	useEffect(() => {
		TakeByRole("Agent d'entretien").then(res => setServiceList(res));
		TakeByRole("Gardien").then(res => setGuardiansList(res));
	}, [props])


	return (
		<div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"100%"}}>
			<Calendar
				localizer={localizer}
				events={eventsList}
				startAccessor="start"
				endAccessor="end"
				onSelectEvent={(e) => handleSelectedEvent(e)}
				style={{height:500, width:"100%"}}
				culture="fr"
				messages={messages}
			/>
			{selectedEvent && update &&
				<UpdateScheduleForm event={selectedEvent} handleCallback={Callback} modalState={modalState} setModalState={setModalState} baseUser={BaseUser(selectedEvent.user, selectedEvent.type)}/>
		    }
		</div>
	)
}