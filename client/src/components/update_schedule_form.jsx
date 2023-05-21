import React, { useState, useEffect, useContext } from "react";
import { Button, Checkbox } from "@mui/material";
import { UpdateSchedule, TakeAllSpots, TakeParking, TakeByRole, placeFromId, TakeAllRoles, userFromToken, TakeAllSchedulesAvailable, DeleteSchedule } from "../services"
import { Separation, AllSchedulesAvailable, AdminVerif } from "../components"
import { AllSpots, BaseParking, FindToggles, NeedS, AllNotNecessary, ChangeDate, ToFrenchISODate } from "../interface"
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { ContextUser } from "../contexts/context_user";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "../css/parking.css"
import ReactModal from 'react-modal';

export function UpdateScheduleForm(props) {

	function CallbackSetOne(childData) {
        setOnlyOne(childData.update)
        setOnlyOneInfo(childData.schedule)
    }

	async function CallbackDelete(childData) {
        const res = await DeleteSchedule(props.event.id_schedule);
		setPopupOpened(false);
        props.handleCallback(false);
        setOnlyOne(childData.update)
        setOnlyOneInfo(childData.schedule)
    }

    /**
     * DeOrDu
     * Returns a string which is de or du depending of the type of the schedule
     *
     * @param { String } type - The type of schedule
     * @return { Array }
     */
    function DeOrDu(type) {
        if(type === "Réunion") {
            return "de"
        } else {
            return "du"
        }
    }

	/**
	 * AllParkings
	 * Returns a lists of options for a Select React component composed of every type 
	 *
	 * @param { Array } list - List of parkings
	 * @return { Array }
	 */
	function AllParkings(list) {
		var opt = []
		for (let i=0; i<list.length; i++) {
			opt.push({value:list[i].id, label:"Parking " + list[i].name.toLowerCase()})
		}
		return opt
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

	/**
	 * BaseListType
	 * Returns a array corresponding to the list of users corresponding to the type
	 *
	 * @param { string } spot - Type of the schedule
	 * @return { Array }
	 */
	function BaseListType(type) {
		if (type === "Gardiennage") {
			return AllServices(guardiansList);
		} else if (type === "Nettoyage") {
			return AllServices(serviceList);
		} else if (type === "Réunion") {
			return AllServices(serviceList).concat(AllServices(guardiansList));
		}
	}

	function AffichagePlaces() {
		let liste = props.event.spots;
		console.log("liste non reverse", liste)
		liste.sort((a, b) =>{ if (a.floor === b.floor) {return a.number > b.number} else {return a.floor > b.floor}})
		console.log("liste reverse", liste)
	
		let nListe = []

		liste.forEach(spot => {
			let floor = spot.floor
			if (Array.isArray(nListe[floor])) {
				nListe[floor].push(spot);
			} else {
				nListe.push([spot]);
			}
		})


		return (
			<div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
				<p>Sur les places : </p>
				<ul style={{marginTop:"-10px"}}>
					{nListe.map(
						(spots, index) => {
							console.log(spots)
							if (spots.length > 1) {
								return <li key={index} >Etage {spots[0].floor} : De la place {spots[spots.length -1].id_park}{spots[spots.length -1].floor}-{spots[spots.length -1].number} à la place {spots[0].id_park}{spots[0].floor}-{spots[0].number}</li>
							}
							else {
								return <li key={index} >Place {spots[0].id_park}{spots[0].floor}-{spots[0].number}</li>
							}
						})
					}
				</ul>
			</div>
		)
	}

	function InformationEvent (infos, baseType) {
		let baseList = props.event.user;
		let listRes = [];
		let i = 0;
		for (let element of baseList) {
			listRes.push(<li key={i} className="li-infos"><strong>-</strong> {element.first_name} {element.last_name}</li>);
			i++;
		}
		let dates_start = props.event.start.toLocaleDateString() + " à " + props.event.start.toLocaleTimeString().slice(0, props.event.start.toLocaleTimeString().length-3);
		let dates_end = props.event.end.toLocaleDateString() + " à " + props.event.end.toLocaleTimeString().slice(0, props.event.end.toLocaleTimeString().length-3);
		return (
			<div>
				<ul className="ul-infos">
					{
						listRes
					}
				</ul>
				{props.event.guests.length !== 0 && <p style={{fontSize:"0.7em", color:"red", display:"flex", justifyContent:"center"}}>Il y a {props.event.guests.length} invité{NeedS(props.event.guests.length)} à cette réunion</p>}
				{baseType === "Nettoyage" && AffichagePlaces()}
				<p>
					{
						"Du " + dates_start + " au " + dates_end
					}
				</p>
			</div>
		);
	}


	function FixOnlyOne(tab) {
        if(typeof tab[0] == "string") {
            return [tab]
        } else {
            return tab
        }
    }

	/**
	 * CheckIfScheduleIn
	 * Check if the schedule is available or not
	 *
	 * @param { JSON } datesCheck - The schedule to check
	 * @param { JSON<Array> } available - All schedules availables
	 * @returns { Boolean }
	 */
	function CheckIfScheduleIn(datesCheck, available) {
		let res = false;
		for (let find of available) {
			if (datesCheck.date_start >= find[0] && datesCheck.date_end <= find[1]) {
				res = true;
			}
		}
		return res;
	}

	const [baseDate, setBaseDate] = useState(new Date().toISOString().slice(0, 19))
	const [optionsSpots, setOptionsSpots] = useState({opts:[], change:true})
	const [optionsUsers, setOptionsUsers] = useState([])
	const [optionsRoles, setOptionsRoles] = useState([])
	const [optionsUsersChange, setOptionsUsersChange] = useState({opts:[], change:false})

	const [infos, setInfos] = useState({
		parking: props.event.idparking,
		users: props.event.user.map(e => e.id),
		spots: props.event.spots.map(e => e.id),
		guests: props.event.guests.map(e => e.id),
		date_start: ToFrenchISODate(props.event.start),
		date_end: ToFrenchISODate(props.event.end)
	});
	const [spotsCleaning, setSpotsCleaning] = useState({first_spot:null, last_spot:null})
	const [spotsList, setSpotsList] = useState([])

	const [wrongInput, setWrongInput] = useState(false);
	const [errMessage, setErrMessage] = useState("");

	const [parkingsList, setParkingsList] = useState([]);
	const [serviceList, setServiceList] = useState([]);
	const [staffList, setStaffList] = useState([]);
	const [horairesSchedules, setHorairesSchedules] = useState({date_start: ToFrenchISODate(props.event.start), date_end: ToFrenchISODate(props.event.end)})
	const [guardiansList, setGuardiansList] = useState([]);
	const [baseType, setBaseType] = useState(props.event.type);
	const [modifiable, setModifiable] = useState(false);

	const [disabled, setDisabled] = useState(false)
	const delay = ms => new Promise(res => setTimeout(res, ms));
	const [checkboxInclude, setCheckboxInclude] = useState(false);

	const { userToken } = useContext(ContextUser);
    const [ infosUser, setInfosUser ] = useState({
        email: "",
        first_name: "",
        id: undefined,
        id_spot: null,
        id_spot_temp: null,
        last_name: "",
        role: "",
    });

	const [isOpen, setIsOpen] = useState(false);
    const [onlyOne, setOnlyOne] = useState(false)
    const [onlyOneInfo, setOnlyOneInfo] = useState({})
	const [schedulesAvailable, setSchedulesAvailable] = useState([]);
	const [changeSchedule, setChangeSchedule] = useState(false)

	const [popupOpened, setPopupOpened] = useState(true)

	const toggleCheckbox = () => {
        setCheckboxInclude(!checkboxInclude);
		if (baseType === "Réunion" && checkboxInclude) {
			for (let i=0; i<infos.users.length; i++) {
				if (infos.users[i] === infosUser.id) {
					let baseUsers = infos.users
					let newInfos = baseUsers.splice(i,1)
					setInfos(values => ({...values, ["users"]: baseUsers}))
				}
			}
		} else if (baseType === "Réunion" && !checkboxInclude) {
			if (!(infos.users.includes(infosUser.id))) {
				let baseUsers = infos.users
				let newInfos = baseUsers.push(infosUser.id)
				setInfos(values => ({...values, ["users"]: baseUsers}))
			}
		}
    }

    const checkboxIcon = () => {
        return checkboxInclude ? <CheckBox /> : <CheckBoxOutlineBlank />;
    }

	const handleChangeSelect = (selectedOptions, name) => {
		var value = [];
		if (selectedOptions.value) {
			if (name.name === "first_spot" || name.name === "last_spot") {
                setSpotsCleaning(values => ({...values, [name.name]: selectedOptions.value}))
			} else if (name.name === "parking") {
				TakeAllSpots(selectedOptions.value).then(res => {
					setOptionsSpots(values => ({...values, opts:AllSpots(res), change: true}))
				})
			}
			value = selectedOptions.value
		} else {
			for (let option of selectedOptions) {
				value.push(option.value)
			}
		}
		if (name.name === "users" && baseType === "Réunion") {
			setOptionsUsersChange(values => ({...values, change: true}))
			UpdateIfNoHourChange({users:value, date_start:ToFrenchISODate(props.event.start), date_end:ToFrenchISODate(props.event.end), id_exclure:props.event.id_schedule})
		}
			if (name.name === "guests" && baseType === "Réunion") {
			setOptionsUsers(AllNotNecessary(staffList, value))
        }
		if (baseType === "Réunion" && checkboxInclude) {
			value.push(infosUser.id)
		}
		setInfos(values => ({...values, [name.name]: value}))
	}

	const handlleSubmit = async (event) => {
		event.preventDefault();
		setWrongInput(false);
		if (infos.users.length === 0) {
			setWrongInput(true)
			setErrMessage("Vous n'avez assigné ce créneau à personne")
		} else if (baseType === "Réunion" && infos.users.length < 2) {
			setWrongInput(true)
            setErrMessage("Vous devez assigner ce créneau à 2 utilisateurs au minimum")
		} else if (horairesSchedules.date_start === baseDate && horairesSchedules.date_end === baseDate) {
			setWrongInput(true)
			setErrMessage("Choisissez une date de début et de fin.")
		} else if (horairesSchedules.date_end < horairesSchedules.date_start) {
			setWrongInput(true)
			setErrMessage("L'heure de fin ne peut pas précéder l'heure de début.")
		} else if (!(infos.parking === props.event.idparking &&
			 JSON.stringify(infos.users) === JSON.stringify(props.event.user.map(e => e.id)) &&
			  JSON.stringify(infos.guests) === JSON.stringify(props.event.guests.map(e => e.id)) &&
			   infos.date_start === ToFrenchISODate(props.event.start) && infos.date_end === ToFrenchISODate(props.event.end) &&
			    JSON.stringify(infos.spots) === JSON.stringify(props.event.spots))) {
			let listSpotsCleaning = [];
            let first, last;
			//Set toggles for spots (only if "Nettoyage") on spots between first and last
            if (baseType === "Nettoyage") {
				first = await placeFromId(spotsCleaning.first_spot).then(first => first)
                last = await placeFromId(spotsCleaning.last_spot).then(last => last)
                listSpotsCleaning = spotsList.filter((el) => {
                    if ((el.floor > first.floor && el.floor < last.floor) ||
                    (el.floor === first.floor && el.floor === last.floor && el.number >= first.number && el.number <= last.number) ||
                    (el.floor === first.floor && el.floor !== last.floor && el.number >= first.number) ||
                    (el.floor === last.floor && el.floor !== first.floor && el.number <= last.number)) {
                        return true
                    }else{
						return false
					}
                })
				infos.spots = FindToggles(props.event.spots.map(e => e.id), listSpotsCleaning.map(e => e.id))
            }
			
			//If it's "Réunion" then parking = null
			if (baseType === "Réunion") {
				infos.parking = '\x00'
				TakeAllSchedulesAvailable({users:infos.users, date_start:horairesSchedules.date_start, date_end:horairesSchedules.date_end, id_exclure:props.event.id_schedule}).then(res => setSchedulesAvailable(FixOnlyOne(res)))
                setIsOpen(true)
			} else {
				//Set toggles for users
				infos.users = FindToggles(props.event.user.map(e => e.id), infos.users)

				const res = await UpdateSchedule(infos, props.event.id_schedule)
				if (res.status === 200) {
					setWrongInput(true);
					setErrMessage("Modification prise en compte.")
					setDisabled(true)
					await delay(2000);
					props.handleCallback(false)
					Modifier()
				} else {
					setWrongInput(true);
					setErrMessage(res.data.message)
				}
			}
		} else {
			setWrongInput(true);
			setErrMessage("Vous n'avez rien modifié");
		}
	}

	function UpdateIfNoHourChange(params) {
		TakeAllSchedulesAvailable(params).then(res => {
			setSchedulesAvailable(FixOnlyOne(res))
			if (CheckIfScheduleIn(horairesSchedules, FixOnlyOne(res))) {
				setChangeSchedule(false)
			}
		})
	}

	const handlleSubmitNewReunion = async (event) => {
        event.preventDefault()
        setWrongInput(false);
        if (infos.date_start === baseDate || infos.date_end === baseDate) {
            setWrongInput(true)
            setErrMessage("Veuillez ne pas laisser la date actuelle.")
        } else {
			//Set toggles for users
			infos.users = FindToggles(props.event.user.map(e => e.id), infos.users)
			//Set toggles for guests
			infos.guests = FindToggles(props.event.guests.map(e => e.id), infos.guests)

            const res = await UpdateSchedule(infos, props.event.id_schedule); 
            if (res.status === 200) {
                setWrongInput(true);
                setErrMessage("Modification prise en compte.");
                await delay(2000);
                setIsOpen(false)
                setPopupOpened(false)
				props.handleCallback(false)
            } else {
                setWrongInput(true);
                setErrMessage(res.data.message);
            }
        }
    }

	const handleNoChangeDate = async (event) => {
		if (checkboxInclude){ // if user want to be in reunion
			if (!infos.users.includes(infosUser.id)){ // if it's not
				infos.users.push(infosUser.id); // add it
			}
		}else{ // if dont want
			if (infos.users.includes(infosUser.id)){ // if he is
				infos.users.splice(infos.users.indexOf(infosUser.id, 1)); // remove it
			}
		}

		// if, by any black magic, connected user is in guest, remove it.
		if (infos.guests.includes(infosUser.id)){
			infos.guests.splice(infos.guests.indexOf(infosUser.id, 1));
		}

		event.preventDefault()
        setWrongInput(false);
		if ((JSON.stringify(infos.users) !== JSON.stringify(props.event.user.map(e => e.id))) || (JSON.stringify(infos.guests) !== JSON.stringify(props.event.guests.map(e => e.id)))) {
			//Set toggles for users
			infos.users = FindToggles(props.event.user.map(e => e.id), infos.users)
			//Set toggles for guests
			infos.guests = FindToggles(props.event.guests.map(e => e.id), infos.guests)
			infos.date_start = horairesSchedules.date_start
			infos.date_end = horairesSchedules.date_end

			const res = await UpdateSchedule(infos, props.event.id_schedule); 
			if (res.status === 200) {
				setWrongInput(true);
				setErrMessage("Modification prise en compte.");
				await delay(2000);
				setIsOpen(false)
				setPopupOpened(false)
				props.handleCallback(false)
			} else {
				setWrongInput(true);
				setErrMessage(res.data.message);
			}
		} else {
			setWrongInput(true);
			setErrMessage("Vous n'avez rien modifié");
		}
	}

	useEffect(() => {
        async function fetchUserInfos() {
            const resInfosUser = await userFromToken(userToken);
            // console.log("resInfosUser", resInfosUser)
            setInfosUser(resInfosUser.data[0]);
			if (props.event.user.map(e => e.id).includes(resInfosUser.data[0].id)) {
				setCheckboxInclude(true)
			}
        }
        fetchUserInfos();
    }, [userToken]);

	useEffect(() => {
		setOptionsUsersChange({opts:AllNotNecessary(staffList, infos.users), change:false})
	}, [optionsUsersChange.change])

	useEffect(() => {
		TakeParking().then(res => {
			setParkingsList(res)
		});
		TakeAllSpots(infos.parking).then(res => {
			setSpotsList(res);
			setOptionsSpots({opts:AllSpots(res), change:false});
		});
		TakeByRole("Agent d'entretien").then(res => setServiceList(res));
		TakeByRole("Gardien").then(res => setGuardiansList(res));
		TakeByRole("Agent d'entretien").then(res => {
            TakeByRole("Gardien").then(res2 => {
                for (let user of res2) {
                    res.push(user)
                }
                setStaffList(res)
				setOptionsUsers(AllNotNecessary(res, props.event.guests.map(e => e.id)))
				setOptionsUsersChange({opts:AllNotNecessary(res, props.event.user.map(e => e.id)), change:false})
            })
        })
		TakeAllRoles().then(res => setOptionsRoles(res))
		UpdateIfNoHourChange({users:infos.users, date_start:ToFrenchISODate(props.event.start), date_end:ToFrenchISODate(props.event.end), id_exclure:props.event.id_schedule})
		setPopupOpened(true)
	}, [props])

	useEffect(() => {
		setBaseType(props.event.type);
		setInfos({
			parking: props.event.idparking,
			users: props.event.user.map(e => e.id),
			spots: props.event.spots.map(e => e.id),
			guests: props.event.guests.map(e => e.id),
			date_start: ToFrenchISODate(props.event.start),
			date_end: ToFrenchISODate(props.event.end)
		});
	}, [props])

	useEffect(() => {
		TakeAllSpots(infos.parking).then(res => {
			setOptionsSpots({opts:AllSpots(res), change:false})
		})
	}, [optionsSpots.change, props])

	const customStyles = {
		overlay: {
			zIndex : 100000
		},
		content: {
			top: '5%',
			left: '25%',
			right: '25%',
			bottom: 'auto',
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			flexDirection:"column",
			marginRight: '-50%',
			width: '50%'
		},
	};

	const customStylesTwo = {
        overlay: {
            zIndex : 100000
        },
        content: {
            top: '15%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection:"column",
            marginRight: '-50%',
            width: '35%',
            height: '75%',
            transform: 'translate(-40%, -10%)'
        },
    };

	function TitleButton(type) {
        if (type === "Nettoyage" || type === "Gardiennage") {
            return <Button
                className="submit_button" 
                variant="contained" 
                color="primary" 
                type="submit"
            >Modifier</Button>
        } else if (type === "Réunion") {
            return <Button
                className="submit_button" 
                variant="contained" 
                color="primary" 
                type="submit"
            >Voir la liste des horaires disponibles</Button>
        }
    }

	function AffichageModifs () {
		return (
			<div className="form_div">
				<h3 style={{textAlign:"center"}}>Modification {DeOrDu(baseType)} {baseType.toLowerCase()} :</h3>
				<form onSubmit={handlleSubmit} className="form">   
					{baseType !== "Réunion" && <div style={{zIndex:1007}}>
						<Select
							id="parking"
							className="size-select-popup"
							options={AllParkings(parkingsList)} 
							placeholder={BaseParking(infos.parking, parkingsList)}
							name="parking" 
							isSearchable={false}
							onChange={handleChangeSelect}
							maxMenuHeight={200}
						/>
					</div>}
					{baseType === "Réunion" && <div style={{zIndex:1007, display:"flex", flexDirection:"column", justifyContent:"center", marginTop:"-30px"}}>  
                        <Separation value="Personnes nécessaires"/>
						<p style={{fontSize:"0.7em", color:"red", marginTop:"-10px"}}>Les personnes nécéssaires seront obligatoirement dans la réunion.</p>
                        <div style={{display:"flex", justifyContent:"center"}}>
                            <Checkbox 
                                style={{color:"blue"}}
                                icon={checkboxIcon()}
                                checked={checkboxInclude}
                                onChange={toggleCheckbox}/>
                            <p>Je veux m'inclure dans la réunion</p>
                        </div>
                        <div style={{zIndex:1008, display:"flex", justifyContent:"center"}}>
                            <Select
                                isMulti
                                name="users"
                                placeholder="Assigner à... (personnes)"
                                options={optionsUsers}
								defaultValue={props.baseUser}
                                className="size-select-popup"
                                onChange={handleChangeSelect}
                                maxMenuHeight={200}
                            />
                        </div>
                        <Separation value="Personnes invitées"/>
						<p style={{fontSize:"0.7em",color:"red", marginTop:"-10px"}}>Les personnes invitées ne participent pas à la réunion si elles ne sont pas libres au moment où elle se déroule.<br/> Le créneau ne sera pas prioritaire pour elles.</p>
                        <div style={{zIndex:1007, display:"flex", justifyContent:"center"}}>
                            <Select
                                isMulti
                                name="guests"
                                placeholder="Inviter... (personnes)"
                                options={optionsUsersChange.opts}
								defaultValue={props.baseGuests}
                                className="size-select-popup"
                                onChange={handleChangeSelect}
                                maxMenuHeight={200}
                            />
                        </div>
                    </div>}
					{baseType !== null && baseType !== "Réunion" && <div style={{zIndex:1006}}>  
						<Select
							isMulti
							name="users"
							options={BaseListType(baseType)}
							defaultValue={props.baseUser}
							className="size-select-popup"
							onChange={handleChangeSelect}
							maxMenuHeight={200}
						/>
					</div>}
					{baseType === "Nettoyage" && <div className="numeros" style={{zIndex:1005}}>
                        <Select
                            options={optionsSpots.opts}
                            style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
                            size="small"
                            id="first_spot"
                            label="Numéro"
                            type="text"
                            name="first_spot"
                            className="size-type"
                            onChange={handleChangeSelect}
							maxMenuHeight={200}
                        />
                        <p style={{margin:"7px 7px 0 7px"}}>à</p>
                        <Select
                            options={optionsSpots.opts}
                            style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
                            size="small"
                            id="last_spot"
                            label="Numéro"
                            type="text"
                            name="last_spot"
                            className="size-type"
                            onChange={handleChangeSelect}
							maxMenuHeight={200}
                        />
                    </div>}
					{baseType === "Réunion" && CheckIfScheduleIn(horairesSchedules, schedulesAvailable) && 
					<div style={{marginBottom:"15px", marginTop:"-25px"}}><Button
						disabled={disabled}
						className="submit_button" 
						variant="contained" 
						color="primary" 
						onClick={handleNoChangeDate}
					>Garder la même horaire</Button></div>}
					{baseType === "Réunion" && !CheckIfScheduleIn(horairesSchedules, schedulesAvailable) && 
					<div style={{marginBottom:"15px", marginTop:"-25px"}}><Button
						disabled={disabled}
						className="submit_button" 
						variant="contained" 
						color="primary" 
						onClick={() => setChangeSchedule(true)}
					>Changer d'horaire</Button></div>}
					{(baseType === "Réunion") && changeSchedule && <div style={{marginTop:"-10px"}}>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>Créneaux disponible entre 2 dates : </div><br/>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}><p style={{margin:"0 7px 7px 7px"}}>Entre</p>
                        <DatePicker
                            name="date_start"
                            selected={new Date(horairesSchedules.date_start)}
                            onChange={(date) => {
								setHorairesSchedules(values => ({...values, ["date_start"]: ToFrenchISODate(date)}))
								UpdateIfNoHourChange({users:infos.users, date_start:ToFrenchISODate(date), date_end:ToFrenchISODate(horairesSchedules.date_end), id_exclure:props.event.id_schedule})
							}}
                            showTimeSelect
                            dateFormat="yyyy:MM:dd hh:mm:ss"
                        />
                        <p style={{margin:"0 7px 7px 7px"}}>et</p>
                        <DatePicker
                            name="date_end"
                            selected={new Date(horairesSchedules.date_end)}
                            onChange={(date) => {
								setHorairesSchedules(values => ({...values, ["date_end"]: ToFrenchISODate(date)}))
								UpdateIfNoHourChange({users:infos.users, date_start:ToFrenchISODate(horairesSchedules.date_start), date_end:ToFrenchISODate(date), id_exclure:props.event.id_schedule})
							}}
                            showTimeSelect
                            dateFormat="yyyy:MM:dd hh:mm:ss"
                        /></div>
                    </div>}
					{(infos.type === "Nettoyage" || infos.type === "Gardiennage") &&<div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
						<DatePicker
							name="date_start"
							selected={new Date(infos.date_start)}
							onChange={(date) => setInfos(values => ({...values, ["date_start"]: date.toISOString().slice(0, 19)}))}
							showTimeSelect
							dateFormat="yyyy:MM:dd hh:mm:ss"
						/>
						<p style={{margin:"0 7px 7px 7px"}}>à</p>
						<DatePicker
							name="date_end"
							selected={new Date(infos.date_end)}
							onChange={(date) => setInfos(values => ({...values, ["date_end"]: date.toISOString().slice(0, 19)}))}
							showTimeSelect
							dateFormat="yyyy:MM:dd hh:mm:ss"
						/>
						<Button
							disabled={disabled}
							className="submit_button" 
							variant="contained" 
							color="primary" 
							type="submit"
						>Modifier</Button>
					</div>}
					{(!CheckIfScheduleIn(horairesSchedules, schedulesAvailable) && changeSchedule || baseType !== "Réunion") && TitleButton(baseType)}
				</form>
				<div style={{display:"flex", justifyContent:"center"}}>{ wrongInput && <p className="err-message" style={{maxWidth:"450px"}}> { errMessage } </p>}</div>
			</div>
		)
	}

	function Modifier() {
		setModifiable(!modifiable);
	}

	return (
		<div>
			<ReactModal
				ariaHideApp={false}
				isOpen={props.modalState && popupOpened}
				contentLabel="Modifier le créneau"
				onRequestClose={() => {
					props.setModalState(false);
					setModifiable(false);
					setWrongInput(false);
				}}
				onAfterOpen={() => {
					setModifiable(false)
					setChangeSchedule(false)
					setHorairesSchedules({date_start:ToFrenchISODate(props.event.start), date_end: ToFrenchISODate(props.event.end)}); 
					UpdateIfNoHourChange({users:infos.users, date_start:ToFrenchISODate(props.event.start), date_end:ToFrenchISODate(props.event.end), id_exclure:props.event.id_schedule})
					setInfos({
						parking: props.event.idparking,
						users: props.event.user.map(e => e.id),
						spots: props.event.spots.map(e => e.id),
						guests: props.event.guests.map(e => e.id),
						date_start: ToFrenchISODate(props.event.start),
						date_end: ToFrenchISODate(props.event.end)
					})
				}}
				style={customStyles}
			>
				<div className="info_reunion">
					<h3>{props.event.type} {props.event.type === "Réunion" ? "avec" : "réalisé par"} :</h3>
					<div>
						{
							InformationEvent(infos, baseType)
						}
					</div>
				</div>
				{
					((!modifiable && baseType !== "Réunion") || (!modifiable && props.admin && baseType === "Réunion")) &&
					<div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
						<Button
							disabled={disabled}
							className="submit_button" 
							variant="contained" 
							color="primary"
							onClick={() => Modifier()}
						>Modification</Button>
						<AdminVerif title="Supprimer ce créneau" text={"Vous êtes sur le point de supprimer ce créneau !"} handleCallback={CallbackDelete}/>
					</div>
				}
				{
					modifiable && AffichageModifs()
				}
			</ReactModal>
			<ReactModal
				ariaHideApp={false}
				isOpen={isOpen}
				onRequestClose={() => {setIsOpen(false);}}
				onAfterOpen={() => {
					setWrongInput(false);
					setOnlyOne(false)
				}}
				style={customStylesTwo}
			>
				<div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
					<p style={{alignText:"center"}}>
						Voici la liste des horaires où toutes les personnes nécéssaires sont disponibles. Choisissez en un et mettez une date et une horaire précise.
					</p>
					<p style={{fontSize:"0.7em",color:"red", marginTop:"-10px"}}>Vous avez invité {infos.guests.length} personne{NeedS(infos.guests.length)} à cette réunion</p>
				</div>
				{onlyOne && <div>
					<div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>Choisir une date entre le {ChangeDate(onlyOneInfo[0].slice(0,10))} à {onlyOneInfo[0].slice(11,19)} et le {ChangeDate(onlyOneInfo[1].slice(0,10))} à {onlyOneInfo[1].slice(11,19)} : </div><br/>  
					<form onSubmit={ handlleSubmitNewReunion } name="form-modif-mdp">
						<div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}><p style={{margin:"0 7px 7px 7px"}}>Entre</p>
							<DatePicker
								name="date_start"
								selected={new Date(infos.date_start)}
								minDate={new Date(onlyOneInfo[0])}
								maxDate={new Date(onlyOneInfo[1])}
								minTime={setHours(setMinutes(new Date(), 0), 8)}
								maxTime={setHours(setMinutes(new Date(), 30), 20)}
								onChange={(date) => setInfos(values => ({...values, ["date_start"]: date.toISOString().slice(0, 19)}))}
								showTimeSelect
								dateFormat="yyyy:MM:dd hh:mm:ss"
							/>
							<p style={{margin:"0 60px 7px 0"}}>et</p>
							<DatePicker
								name="date_end"
								selected={new Date(infos.date_end)}
								minDate={new Date(onlyOneInfo[0])}
								maxDate={new Date(onlyOneInfo[1])}
								minTime={setHours(setMinutes(new Date(), 0), 8)}
								maxTime={setHours(setMinutes(new Date(), 30), 20)}
								onChange={(date) => setInfos(values => ({...values, ["date_end"]: date.toISOString().slice(0, 19)}))}
								showTimeSelect
								dateFormat="yyyy:MM:dd hh:mm:ss"
							/>
						</div>
					<div className="input-div" style={{marginTop:'20px'}}>
						<Button
							className="submit_button"
							variant="contained" 
							color="primary"
							type="submit"
						>Valider cette horaire</Button>
					</div>
					</form>
				</div>}
				<div style={{maxHeight:"300px", overflowY: "auto", paddingRight:"20px", marginTop:"10px"}}>
					{schedulesAvailable.map((schedule, index) => (
						<AllSchedulesAvailable key={index} schedule={schedule} optionals={infos.guests} handleCallback={CallbackSetOne}/>
					))}
				</div>
				{ wrongInput && <p className="err_message"> { errMessage } </p>}
			</ReactModal>
		</div>
	)
}