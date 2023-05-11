import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { UpdateSchedule, DeleteSchedule, CreationSchedule, TakeAllSpots, TakeParking, TakeByRole } from "../services"
import { AllSpots, BaseSpot } from "../interface"
import Select from 'react-select';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import "../css/parking.css"
import ReactModal from 'react-modal';

export function UpdateScheduleForm(props) {

    /**
     * DeOrDu
     * Returns a string which is de or du depending of the type of the schedule
     *
     * @param { String } type - The type of schedule
     * @return { Array }
     */
    function DeOrDu(type) {
        if(type == "Réunion") {
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
            return AllServices(guardiansList)
        } else if (type == "Nettoyage") {
            return AllServices(serviceList)
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
     * BaseSpot
     * Returns a array corresponding to the base spot being passed in a react select defaultValue
     *
     * @param { integer } spot - id of the spot
     * @param { Array } list - List of options being passed in a react select
     * @return { Array }
     */
    function BaseSpot(spot, list) {
        var opts=[]
        for (let s of list) {
            if (s.value === spot) {
                opts.push(s);
            }
        }
        if (opts.length !== 0) {
            return opts[0].label
        } else {
            return ""
        }
    }

    const [optionsSpots, setOptionsSpots] = useState({opts:[], change:true})

    

    const [infos, setInfos] = useState({parking: props.event.idparking, 
                                        user: props.event.user, 
                                        date_start: props.event.d_st, 
                                        date_end: props.event.d_en,
                                        first_spot:props.event.first_spot,
                                        last_spot:props.event.last_spot});

	const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const [parkingsList, setParkingsList] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [guardiansList, setGuardiansList] = useState([]);
    const [baseType, setBaseType] = useState(props.event.type)
    
    const [disabled, setDisabled] = useState(false)
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const handleChangeSelect = (selectedOptions, name) => {
        var value = [];
        if (selectedOptions.value) {
            if (name.name === "parking") {
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
        setInfos(values => ({...values, [name.name]: value}))
    }

	const handlleSubmit = async (event) => {
        event.preventDefault()
        setWrongInput(false);
        if (infos.user.length === 0) {
            setWrongInput(true)
            setErrMessage("Vous n'avez assigné ce créneau à personne")
        }
        else if (!(infos.parking === props.event.idparking && infos.user === props.event.user && infos.date_start === props.event.d_st && infos.date_end === props.event.d_en && infos.first_spot === props.event.first_spot && infos.last_spot === props.event.last_spot)) {
            var scheduleAdded = 0;
            var nbModif = 0;
            let stock = infos.user
            var fun;
            for (let i=0; i<props.event.user.length; i++) {
                infos.user = stock[i]
                if (!(props.event.user.includes(infos.user))) {
                    fun = DeleteSchedule(props.event.id_schedule[i]);
                    nbModif++;
                }
                if (fun) {
                    const res = await fun
                    if (res.status === 200) {
                        scheduleAdded++;
                    } else {
                        setWrongInput(true);
                        setErrMessage(res.data.message);
                        break;
                    }
                }
            }
            for (let i=0; i<stock.length; i++) {
                infos.user = stock[i]
                if (props.event.user.includes(infos.user)) {
                    fun = UpdateSchedule(infos, props.event.id_schedule[i]);
                    nbModif++;
                } else {
                    fun = CreationSchedule(infos);
                    nbModif++;
                }
                if (fun) {
                    const res = await fun
                    if (res.status === 200) {
                        scheduleAdded++;
                    } else {
                        setWrongInput(true);
                        setErrMessage(res.data.message);
                        break;
                    }
                }
            }
            if (scheduleAdded === nbModif) {
                setWrongInput(true);
                setErrMessage("Modification prise en compte.")
                setDisabled(true)
                await delay(2000);
                props.handleCallback(false)
            }
            infos.user = stock
        } else {
            setWrongInput(true);
            setErrMessage("Vous n'avez rien modifié");
        }
    }

    useEffect(() => {
        TakeParking().then(res => setParkingsList(res));
        TakeAllSpots(infos.parking).then(res => {
            setOptionsSpots({opts:AllSpots(res), change:false});
        });
        TakeByRole("Agent d'entretien").then(res => setServiceList(res));
        TakeByRole("Gardien").then(res => setGuardiansList(res));
    }, [])

    useEffect(() => {
        TakeAllSpots(infos.parking).then(res => {
            setOptionsSpots({opts:AllSpots(res), change:false})
        })
    }, [optionsSpots.change])

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

    return (
		<div>
			<ReactModal
				ariaHideApp={false}
                isOpen={props.modalState}
                contentLabel="Modifier le créneau"
                onRequestClose={() => props.setModalState(false)}
                style={customStyles}
			>
				<div className="info_reunion">
					
				</div>
				<div className="form_div">
					<h3 style={{textAlign:"center"}}>Modification {DeOrDu(baseType)} {baseType.toLowerCase()} :</h3>
					<form onSubmit={handlleSubmit} className="form">   
						<div style={{zIndex:1007}}>
							<Select
								id="parking"
								className="searchs-add"
								options={AllParkings(parkingsList)} 
								placeholder={BaseParking(infos.parking, parkingsList)}
								name="parking" 
								isSearchable={false}
								onChange={handleChangeSelect}
								maxMenuHeight={200}
							/>
						</div> 
						<div style={{zIndex:1006}}>  
							<Select
								isMulti
								name="user"
								options={BaseListType(baseType)}
								defaultValue={BaseUser(infos.user, baseType)}
								className="search-add-two"
								onChange={handleChangeSelect}
								maxMenuHeight={200}
							/>
						</div>
						{baseType == "Nettoyage" && <div className="numeros" style={{zIndex:1005}}>
							<Select
								options={optionsSpots.opts}
								style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
								size="small"
								id="first_spot"
								placeholder={BaseSpot(infos.first_spot, optionsSpots.opts)}
								type="text"
								name="first_spot"
								className="search"
								onChange={handleChangeSelect}
								maxMenuHeight={150}
							/>
							<p style={{margin:"7px 7px 0 7px"}}>à</p>
							<Select
								options={optionsSpots.opts}
								style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
								size="small"
								id="last_spot"
								placeholder={BaseSpot(infos.last_spot, optionsSpots.opts)}
								type="text"
								name="last_spot"
								className="search"
								onChange={handleChangeSelect}
								maxMenuHeight={150}
							/>
						</div>}
						<div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
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
						</div>
						<Button
							disabled={disabled}
							className="submit_button" 
							variant="contained" 
							color="primary" 
							type="submit"
						>Modifier</Button>
					</form>
					{ wrongInput && <p className="err-message" style={{maxWidth:"450px"}}> { errMessage } </p>}
				</div>
			</ReactModal>
		</div>
    )
}

