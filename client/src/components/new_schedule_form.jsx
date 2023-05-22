import React, { useState, useEffect, useContext } from "react";
import { Button, Checkbox } from "@mui/material";
import { CreationSchedule, placeFromId, TakeAllSpots, TakeParking, TakeByRole, TakeAllRoles, TakeAllSchedulesAvailable, userFromToken } from "../services"
import { AllSchedulesAvailable, Separation } from "../components";
import { SpotName, NeedS, ChangeDate, AllNotNecessary, ToFrenchISODate } from "../interface"
import { ContextUser } from "../contexts/context_user";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import Select from 'react-select';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import ReactModal from 'react-modal';
import "../css/parking.css";
import fr from "date-fns/locale/fr";
registerLocale("fr", fr);

export function NewScheduleForm(props) {

    /**
     * AllSpots
     * Returns a lists of options for a Select React component composed of every type 
     *
     * @param { Array } list - List of spots in the parking
     * @return { Array }
     */
    function AllSpots(list) {
        var opt = []
        for (let spot of list) {
            opt.push({value:spot.id, label:"Place " + SpotName(spot)})
        }
        return opt
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
        for (let parking of list) {
            opt.push({value:parking.id, label:"Parking " + parking.name.toLowerCase()})
        }
        return opt
    }

    /**
     * AllServices
     * Returns a list of options for a Select React component composed of every type 
     *
     * @param { Array } list - List of service
     * @return { Array }
     */
    function AllServices(list) {
        var opt = []
        for (let user of list) {
            opt.push({value:user.id, label:user.first_name + " " + user.last_name})
        }
        return opt
    }

    /**
     * AllRoles
     * Returns a list of options for a Select React component composed of every role
     * 
     * @param { Array } list - List of roles
     * @return { Array }
     */
    function AllRoles(list) {
        var opt = []
        for (let role of list) {
            if (role.name !== "Abonné" && role.name !== "Gérant") {
                opt.push({value:role.name, label:role.name})
            }
        }
        return opt
    }

    const [optionsSpots, setOptionsSpots] = useState({opts:[], change:true})
    const [optionsUsers, setOptionsUsers] = useState([])
    const [optionsRoles, setOptionsRoles] = useState([])
	const [staffList, setStaffList] = useState([])
	const [optionsUsersChange, setOptionsUsersChange] = useState({opts:[], change:false})

    const [baseDate, setBaseDate] = useState(new Date().toISOString().slice(0, 19))
    const [infos, setInfos] = useState({parking: null, type:null, users:[], date_start: baseDate, date_end: baseDate});
    const [spotsCleaning, setSpotsCleaning] = useState({first_spot:null, last_spot:null})

    const delay = ms => new Promise(res => setTimeout(res, ms));

	const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const [spotsList, setSpotsList] = useState([])
    const [parkingsList, setParkingsList] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [guardiansList, setGuardiansList] = useState([]);
    const [schedulesAvailable, setSchedulesAvailable] = useState([]);
    
    const [infosReunions, setInfosReunions] = useState({parking:'\x00', type:"Réunion", date_start: baseDate, date_end: baseDate, users:[], roles:[], guests:[]})
    const [horairesSchedules, setHorairesSchedules] = useState({date_start: baseDate, date_end: baseDate})
    const [checkboxInclude, setCheckboxInclude] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [onlyOne, setOnlyOne] = useState(false)
    const [onlyOneInfo, setOnlyOneInfo] = useState({})

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

    const [popupOpened, setPopupOpened] = useState(false)
    
    const [editable, setEditable] = useState(true)

    const toggleCheckbox = () => {
        setCheckboxInclude(!checkboxInclude);
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
                TakeAllSpots(selectedOptions.value).then(res => setSpotsList(res))
                setOptionsSpots(values => ({...values, change: true}))
            } else if (name.name === "type") {
                let liste = [];
                if (selectedOptions.value === "Gardiennage") {
                    liste = guardiansList
                } else if (selectedOptions.value === "Nettoyage") {
                    liste = serviceList
                } else if (selectedOptions.value === "Réunion") {
                    liste = staffList
                }
                setOptionsUsers(AllServices(liste))
                setEditable(false)
            }
            value = selectedOptions.value
        } else {
            for (let option of selectedOptions) {
                value.push(option.value)
            }
        }
        if ((name.name === "users" || name.name === "roles" || name.name === "guests") && infos.type === "Réunion") {
            setInfosReunions(values => ({...values, [name.name]: value}))
			if (name.name === "users") {
				setOptionsUsersChange(values => ({...values, change: true}))
            } else if (name.name === "guests") {
			    setOptionsUsers(AllNotNecessary(staffList, value))
            }
        } else if (!(name.name === "first_spot" || name.name === "last_spot")) {
            setInfos(values => ({...values, [name.name]: value}))
        }
    }

    function FixOnlyOne(tab) {
        if(typeof tab[0] == "string") {
            return [tab]
        } else {
            return tab
        }
    }

	const handlleSubmit = async (event) => {
        event.preventDefault()
        setWrongInput(false);
        var isSubmit = false;
        if (infos.type === "Réunion") {
            if (checkboxInclude) {
                if (!(infosReunions.users.includes(infosUser.id))) {
                    infosReunions.users.push(infosUser.id)
                }
            }
            if (infosReunions.users.length < 2) {
                setWrongInput(true)
                setErrMessage("Vous devez assigner ce créneau à 2 utilisateurs au minimum")
            } else if (horairesSchedules.date_start === baseDate && horairesSchedules.date_end === baseDate) {
                setWrongInput(true)
                setErrMessage("Choisissez une date de début et de fin.")
            } else if (horairesSchedules.date_end < horairesSchedules.date_start) {
                setWrongInput(true)
                setErrMessage("L'heure de fin ne peut pas précéder l'heure de début.")
            } else {
                TakeAllSchedulesAvailable({users:infosReunions.users, date_start:horairesSchedules.date_start, date_end:horairesSchedules.date_end}).then(res => setSchedulesAvailable(FixOnlyOne(res)))
                setIsOpen(true)
            }
        } else {
            let listSpotsCleaning = [];
            let first, last;
            if (infos.type === "Nettoyage") {
                first = await placeFromId(spotsCleaning.first_spot).then(first => first)
                last = await placeFromId(spotsCleaning.last_spot).then(last => last)
                listSpotsCleaning = spotsList.filter((el) => {
                    if ((el.floor > first.floor && el.floor < last.floor) ||
                    (el.floor === first.floor && el.floor === last.floor && el.number >= first.number && el.number <= last.number) ||
                    (el.floor === first.floor && el.floor !== last.floor && el.number >= first.number) ||
                    (el.floor === last.floor && el.floor !== first.floor && el.number <= last.number)) {
                        return el.id
                    }
                })
                infos.spots = listSpotsCleaning.map(el => el.id)
            }

            if (infos.users.length === 0) {
                setWrongInput(true)
                setErrMessage("Vous n'avez assigné ce créneau à personne")
            } else if (infos.date_start === baseDate || infos.date_end === baseDate) {
                setWrongInput(true)
                setErrMessage("Veuillez ne pas laisser la date actuelle.")
            } else {
                if (!Array.isArray(infos.users)) {
                    infos.users = [infos.users]
                }
                const res = await CreationSchedule(infos); 
                if (res.status === 200) {
                    if (JSON.stringify(optionsUsers) === JSON.stringify(AllServices(serviceList))) {
                        if (spotsCleaning.last_spot === spotsCleaning.first_spot) {
                            setErrMessage("Place " + SpotName(first) + "  bloquée pour être nettoyée");
                            isSubmit = true;
                        } else {
                            setErrMessage("Places " + SpotName(first) + " à " + SpotName(last) + "  bloquées pour être nettoyées");
                            isSubmit = true;
                        }
                    } else {
                        TakeParking(infos.parking).then(res => {
                            setErrMessage("Parking " + res.name + " supervisé par " + infos.users.length + " gardien" + NeedS(infos.users.length) + " du " + ChangeDate(infos.date_start.slice(0,10)) + " à " + infos.date_start.slice(11,19) + " au " +  ChangeDate(infos.date_end.slice(0,10)) + " à " + infos.date_end.slice(11,19));
                        })
                        isSubmit = true;
                    }
                } else {
                    setWrongInput(true);
                    setErrMessage(res.data.message);
                }
            }
        }
        if (isSubmit) {
            setWrongInput(true);
            props.handleCallback(false)
			await delay(2000);
			setPopupOpened(false)
        }
	}

    const handlleSubmitNewReunion = async (event) => {
        event.preventDefault()
        setWrongInput(false);
        if (infosReunions.date_start === baseDate || infosReunions.date_end === baseDate) {
            setWrongInput(true)
            setErrMessage("Veuillez ne pas laisser la date actuelle.")
        } else {
            const res = await CreationSchedule(infosReunions); 
            if (res.status === 200) {
                setWrongInput(true);
                setErrMessage("Réunion placée du " + ChangeDate(infosReunions.date_start.slice(0,10)) + " à " + infosReunions.date_start.slice(11,19) + " au " + ChangeDate(infosReunions.date_end.slice(0,10)) + " à " + infosReunions.date_end.slice(11,19));
                await delay(2000);
                setIsOpen(false)
                setPopupOpened(false)
            } else {
                setWrongInput(true);
                setErrMessage(res.data.message);
            }
        }
    }

    var optionsParking = AllParkings(parkingsList)
    const newScheduleOptions = [{value:"Gardiennage", label: "Gardiennage"}, {value:"Nettoyage", label:"Nettoyage"}, {value:"Réunion", label:"Réunion"}]

    useEffect(() => {
        TakeParking().then(res => {
            setParkingsList(res);
            TakeAllSpots(res[0].id).then(res => setSpotsList(res))
        });
    }, [])

    useEffect(() => {
        TakeByRole("Agent d'entretien").then(res => setServiceList(res))
    }, [])

    useEffect(() => {
        TakeByRole("Gardien").then(res => setGuardiansList(res))
    }, [])

    useEffect(() => {
        TakeByRole("Agent d'entretien").then(res => {
            TakeByRole("Gardien").then(res2 => {
                for (let user of res2) {
                    res.push(user)
                }
                setStaffList(res)
				setOptionsUsersChange({opts:AllServices(res), change:false})
            })
        })
    }, [])

    useEffect(() => {
        TakeAllRoles().then(res => setOptionsRoles(res))
    }, [])

    useEffect(() => {
        async function fetchUserInfos() {
            const resInfosUser = await userFromToken(userToken);
            setInfosUser(resInfosUser.data[0]);
        }
        fetchUserInfos();
    }, [userToken]);


    useEffect(() => {
        setOptionsSpots({opts:AllSpots(spotsList), change:false})
    }, [optionsSpots.change])

	useEffect(() => {
		setOptionsUsersChange({opts:AllNotNecessary(staffList, infosReunions.users), change:false})
	}, [optionsUsersChange.change])

    const customStyles = {
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
            >Ajouter</Button>
        } else if (type === "Réunion") {
            return <Button
                className="submit_button" 
                variant="contained" 
                color="primary" 
                type="submit"
            >Voir la liste des horaires disponibles</Button>
        }
    }

    function CallbackSetOne(childData) {
        setOnlyOne(childData.update)
        setOnlyOneInfo(childData.schedule)
    }

    return (<div>
        <Button variant="contained" color="primary" onClick={() => setPopupOpened(true)}
        style={{
            backgroundColor: "#FE434C",
            borderColor: "transparent",
            borderRadius: 20,
            width: "16%",
            marginLeft: "42%",
            height:"100px",
            marginBottom:"100px"
        }}>Ajouter des créneaux de travail</Button>
        <ReactModal
            ariaHideApp={false}
            isOpen={popupOpened}
            contentLabel="Modifier le créneau"
            onAfterOpen={() => {
                setWrongInput(false); 
                setEditable(true); 
                setCheckboxInclude(false)
                setInfos({parking: null, users: [], type:null, date_start:baseDate, date_end: baseDate}); 
                setInfosReunions({parking: '\x00', users: [], roles:[], guests:[], type:"Réunion", date_start:baseDate, date_end: baseDate});
                setSpotsCleaning({first_spot:null, last_spot:null}) 
                setHorairesSchedules({date_start:baseDate, date_end: baseDate}); 
                setOptionsUsers([]);
                setOptionsSpots({opts:[], change:true})
                setOptionsRoles([])
                setOptionsUsersChange({opts:[], change:false})
            }}
            onRequestClose={() => {
                setPopupOpened(false);
            }}
            style={customStyles}
        >
            <div className="form_div">
                <h3 style={{textAlign:"center"}}>Ajout d'un nouveau créneau</h3>
                <form onSubmit={handlleSubmit} className="form"> 
                    <div style={{zIndex:1008}}>
                        <Select 
                            isDisabled={!editable}
                            id="type"
                            className="size-type"
                            options={newScheduleOptions} 
                            placeholder="Type de créneau..."
                            name="type" 
                            isSearchable={false}
                            onChange={handleChangeSelect}
							maxMenuHeight={200}
                        />
                    </div>  
                    {(infos.type === "Gardiennage" || infos.type === "Nettoyage") && <div style={{zIndex:1007}}>   
                        <Select 
                            id="parking"
                            className="size-select-popup"
                            options={optionsParking} 
                            placeholder="Choisir un parking..."
                            name="parking" 
                            isSearchable={false}
                            onChange={handleChangeSelect}
							maxMenuHeight={200}
                        />
                    </div>}
                    {infos.type === "Réunion" && <div style={{zIndex:1007, display:"flex", flexDirection:"column", justifyContent:"center", marginTop:"-30px"}}>  
                        <Separation value="Personnes nécéssaires"/>
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
                                className="size-select-popup"
                                onChange={handleChangeSelect}
                                maxMenuHeight={200}
                            />
                        </div>
                        <div style={{zIndex:1006, display:"flex", justifyContent:"center"}}>
                            <Select
                                isMulti
                                name="roles"
                                placeholder="Inviter... (rôles)"
                                options={AllRoles(optionsRoles)}
                                className="size-select-popup"
                                isSearchable={false}
                                onChange={handleChangeSelect}
                                maxMenuHeight={200}
                            />
                        </div>
                    </div>}
                    {infos.type !== null && infos.type !== "Réunion" && <div style={{zIndex:1006}}>  
                        <Select
                            isMulti
                            name="users"
                            placeholder="Assigner à... (personnes)"
                            options={optionsUsers}
                            className="size-select-popup"
                            onChange={handleChangeSelect}
							maxMenuHeight={200}
                        />
                    </div>}
                    {infos.type === "Nettoyage" && <div className="numeros" style={{zIndex:1005}}>
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
                    {(infos.type === "Nettoyage" || infos.type === "Gardiennage") && <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                        <DatePicker
                            name="date_start"
                            locale="fr"
                            selected={new Date(infos.date_start)}
                            onChange={(date) => setInfos(values => ({...values, ["date_start"]: ToFrenchISODate(date)}))}
                            showTimeSelect
                            dateFormat="yyyy:MM:dd hh:mm:ss"
                        />
                        <p style={{margin:"0 7px 7px 7px"}}>à</p>
                        <DatePicker
                            name="date_end"
                            locale="fr"
                            selected={new Date(infos.date_end)}
                            onChange={(date) => setInfos(values => ({...values, ["date_end"]: ToFrenchISODate(date)}))}
                            showTimeSelect
                            dateFormat="yyyy:MM:dd hh:mm:ss"
                        />
                    </div>}
                    {(infos.type === "Réunion") && <div style={{marginTop:"-10px"}}>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>Créneaux disponible entre 2 dates : </div><br/>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}><p style={{margin:"0 7px 7px 7px"}}>Entre</p>
                        <DatePicker
                            name="date_start"
                            locale="fr"
                            selected={new Date(horairesSchedules.date_start)}
                            onChange={(date) => setHorairesSchedules(values => ({...values, ["date_start"]: ToFrenchISODate(date)}))}
                            showTimeSelect
                            dateFormat="yyyy:MM:dd hh:mm:ss"
                        />
                        <p style={{margin:"0 7px 7px 7px"}}>et</p>
                        <DatePicker
                            locale="fr"
                            name="date_end"
                            selected={new Date(horairesSchedules.date_end)}
                            onChange={(date) => setHorairesSchedules(values => ({...values, ["date_end"]: ToFrenchISODate(date)}))}
                            showTimeSelect
                            dateFormat="yyyy:MM:dd hh:mm:ss"
                        /></div>
                    </div>}
                    {TitleButton(infos.type)}
                </form>
                <div style={{display:"flex", justifyContent:"center"}}>{ wrongInput && <p className="err-message" style={{maxWidth:"450px"}}> { errMessage } </p>}</div>
            </div>
        </ReactModal>
        <ReactModal
            ariaHideApp={false}
            isOpen={isOpen}
            onRequestClose={() => {setIsOpen(false);}}
            onAfterOpen={() => {
                setWrongInput(false);
                setOnlyOne(false)
            }}
            style={customStyles}
        >
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                <p style={{alignText:"center"}}>
                    Voici la liste des horaires où toutes les personnes nécéssaires sont disponibles. Choisissez en un et mettez une date et une horaire précise.
                </p>
                <p style={{fontSize:"0.7em",color:"red", marginTop:"-10px"}}>Vous avez invité {infosReunions.guests.length} personne{NeedS(infosReunions.guests.length)} à cette réunion</p>
            </div>
            {onlyOne && <div>
                <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>Choisir une date entre le {ChangeDate(onlyOneInfo[0].slice(0,10))} à {onlyOneInfo[0].slice(11,19)} et le {ChangeDate(onlyOneInfo[1].slice(0,10))} à {onlyOneInfo[1].slice(11,19)} : </div><br/>  
                <form onSubmit={ handlleSubmitNewReunion } name="form-modif-mdp">
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}><p style={{margin:"0 7px 7px 7px"}}>Entre</p>
                        <DatePicker
                            name="date_start"
                            locale="fr"
                            selected={new Date(infosReunions.date_start)}
                            minDate={new Date(onlyOneInfo[0])}
                            maxDate={new Date(onlyOneInfo[1])}
                            minTime={setHours(setMinutes(new Date(), 0), 7)}
                            maxTime={setHours(setMinutes(new Date(), 30), 20)}
                            onChange={(date) => setInfosReunions(values => ({...values, ["date_start"]: ToFrenchISODate(date)}))}
                            showTimeSelect
                            dateFormat="yyyy:MM:dd hh:mm:ss"
                        />
                        <p style={{margin:"0 60px 7px 0"}}>et</p>
                        <DatePicker
                            name="date_end"
                            locale="fr"
                            selected={new Date(infosReunions.date_end)}
                            minDate={new Date(onlyOneInfo[0])}
                            maxDate={new Date(onlyOneInfo[1])}
                            minTime={setHours(setMinutes(new Date(), 0), 7)}
                            maxTime={setHours(setMinutes(new Date(), 30), 20)}
                            onChange={(date) => setInfosReunions(values => ({...values, ["date_end"]: ToFrenchISODate(date)}))}
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
            <div style={{maxHeight:"300px", overflowY: "auto", paddingRight:"20px"}}>
				{schedulesAvailable.map((schedule, index) => (
					<AllSchedulesAvailable schedule={schedule} optionals={infosReunions.guests} handleCallback={CallbackSetOne}/>
            	))}
			</div>
            { wrongInput && <p className="err_message"> { errMessage } </p>}
        </ReactModal>
        </div>
    )
}