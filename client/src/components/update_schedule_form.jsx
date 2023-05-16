import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { UpdateSchedule, TakeAllSpots, TakeParking, TakeByRole, placeFromId } from "../services"
import { AllSpots, BaseParking, FindToggles } from "../interface"
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
		if (type == "Gardiennage") {
			return AllServices(guardiansList);
		} else if (type == "Nettoyage") {
			return AllServices(serviceList);
		} else if (type == "Réunion") {
			return AllServices(serviceList).concat(AllServices(guardiansList));
		}
	}

	function AffichagePlaces() {
		let liste = props.event.spots;
	
		let nListe = []

		liste.map((spot) => {
			let floor = spot.floor
			if (Array.isArray(nListe[spot.floor])) {
				nListe[floor].push(spot);
			} else {
				nListe.push([spot]);
			}
		})
		
		function CompletePlace (number) {
			let res = ""
			if (number < 10) {
				res = "0"
			}
			return res
		}

		for (let spots of nListe) {
			spots.sort();
		}

		return (
			<div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
				<p>Sur les places : </p>
				<ul style={{marginTop:"-10px"}}>
					{nListe.map(
						(spots) => {
							if (spots.length > 1) {
								return <li>Etage {spots[0].floor} : De la place {spots[0].id_park}-{spots[0].floor}{CompletePlace(spots[0].number)}{spots[0].number} à la place {spots[spots.length -1].id_park}-{spots[spots.length -1].floor}{CompletePlace(spots[spots.length -1].number)}{spots[spots.length -1].number}</li>
							}
							else {
								return <li>Place {spots[0].id_park}-{spots[0].floor}{CompletePlace(spots[0].number)}{spots[0].number}</li>
							}
						})
					}
				</ul>
			</div>
		)
	}

	function InformationEvent (infos, baseType) {
		let baseList = props.event.user;
		let listRes = Array()
		for (let element of baseList) {
			listRes.push(<li className="li-infos"><strong>-</strong> {element.first_name} {element.last_name}</li>)
		}
		let dates_start = props.event.start.toLocaleDateString() + " à " + props.event.start.toLocaleTimeString().slice(0, props.event.start.toLocaleTimeString().length-3)
		let dates_end = props.event.end.toLocaleDateString() + " à " + props.event.end.toLocaleTimeString().slice(0, props.event.end.toLocaleTimeString().length-3)
		return (
			<div>
				<ul className="ul-infos">
					{
						listRes
					}
				</ul>
				{baseType === "Nettoyage" && AffichagePlaces()}
				<p>
					{
						"Du " + dates_start + " au " + dates_end
					}
				</p>
			</div>
		);
	}

	const [optionsSpots, setOptionsSpots] = useState({opts:[], change:true})

	console.log(props.event.d_st.slice(0,19), props.event.d_en.slice(0,19))

	const [infos, setInfos] = useState({
		parking: props.event.idparking,
		users: props.event.user.map(e => e.id),
		spots: props.event.spots.map(e => e.id),
		date_start: props.event.d_st.slice(0,19),
		date_end: props.event.d_en.slice(0,19)
	});
	const [spotsCleaning, setSpotsCleaning] = useState({first_spot:null, last_spot:null})
	const [spotsList, setSpotsList] = useState([])

	const [wrongInput, setWrongInput] = useState(false);
	const [errMessage, setErrMessage] = useState("");

	const [parkingsList, setParkingsList] = useState([]);
	const [serviceList, setServiceList] = useState([]);
	const [guardiansList, setGuardiansList] = useState([]);
	const [baseType, setBaseType] = useState(props.event.type);
	const [modifiable, setModifiable] = useState(false);

	const [disabled, setDisabled] = useState(false)
	const delay = ms => new Promise(res => setTimeout(res, ms));

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
		setInfos(values => ({...values, [name.name]: value}))
	}

	const handlleSubmit = async (event) => {
		event.preventDefault()
		setWrongInput(false);
		if (infos.users.length === 0) {
			setWrongInput(true)
			setErrMessage("Vous n'avez assigné ce créneau à personne")
		} else if (!(infos.parking === props.event.idparking && JSON.stringify(infos.users) === JSON.stringify(props.event.user.map(e => e.id)) && infos.date_start === props.event.d_st && infos.date_end === props.event.d_en && JSON.stringify(infos.spots) === JSON.stringify(props.event.spots))) {
			if (JSON.stringify(infos.users) !== JSON.stringify(props.event.user.map(e => e.id))) {
				infos.users = FindToggles(props.event.user.map(e => e.id), infos.users)
			} else {
				infos.users = []
			}
			let listSpotsCleaning = [];
            let first, last;
            if (baseType === "Nettoyage") {
                first = await placeFromId(spotsCleaning.first_spot).then(first => first)
                last = await placeFromId(spotsCleaning.last_spot).then(last => last)
                listSpotsCleaning = spotsList.filter((el) => {
                    if ((el.floor > first.floor && el.floor < last.floor) ||
                    (el.floor === first.floor && el.floor === last.floor && el.number >= first.number && el.number <= last.number) ||
                    (el.floor === first.floor && el.floor !== last.floor && el.number >= first.number) ||
                    (el.floor === last.floor && el.floor !== first.floor && el.number <= last.number)) {
                        return true
                    }
                })
				infos.spots = listSpotsCleaning.map(e => e.id);
				if (JSON.stringify(infos.spots) !== JSON.stringify(props.event.spots.map(e => e.id))) {
					infos.spots = FindToggles(props.event.spots.map(e => e.id), infos.spots)
				} else {
					infos.spots = []
				}
            }
			console.log(infos)
			const res = await UpdateSchedule(infos, props.event.id_schedule)
			if (res.status === 200) {
				setWrongInput(true);
				setErrMessage("Modification prise en compte.")
				setDisabled(true)
				await delay(2000);
				props.handleCallback(false)
				Modifier()
			}
		} else {
			setWrongInput(true);
			setErrMessage("Vous n'avez rien modifié");
		}
	}

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
	}, [props])

	useEffect(() => {
		setBaseType(props.event.type);
		setInfos({
			parking: props.event.idparking,
			users: props.event.user.map(e => e.id),
			spots: props.event.spots.map(e => e.id),
			date_start: props.event.d_st.slice(0,19),
			date_end: props.event.d_en.slice(0,19)
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

	function AffichageModifs () {
		return (
			<div className="form_div">
				<h3 style={{textAlign:"center"}}>Modification {DeOrDu(baseType)} {baseType.toLowerCase()} :</h3>
				<form onSubmit={handlleSubmit} className="form">   
					<div style={{zIndex:1007}}>
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
					</div> 
					<div style={{zIndex:1006}}>  
						<Select
							isMulti
							name="users"
							options={BaseListType(baseType)}
							defaultValue={props.baseUser}
							className="size-select-popup"
							onChange={handleChangeSelect}
							maxMenuHeight={200}
						/>
					</div>
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
				isOpen={props.modalState}
				contentLabel="Modifier le créneau"
				onRequestClose={() => {
					props.setModalState(false);
					setModifiable(false);
					setWrongInput(false);
				}}
				onAfterOpen={() => {
					setModifiable(false)
					setInfos({
						parking: props.event.idparking,
						users: props.event.user.map(e => e.id),
						spots: props.event.spots.map(e => e.id),
						date_start: props.event.d_st.slice(0,19),
						date_end: props.event.d_en.slice(0,19)
					})
				}}
				style={customStyles}
			>
				<div className="info_reunion">
					<h3>{props.event.type} {props.event.type==="Réunion"? "avec": "réalisé par"} :</h3>
					<div>
						{
							InformationEvent(infos, baseType)
						}
					</div>
				</div>
				{
					!modifiable && 
					<Button
						disabled={disabled}
						className="submit_button" 
						variant="contained" 
						color="primary"
						onClick={() => Modifier()}
					>Modification</Button>
				}
				{
					modifiable && AffichageModifs()
				}
			</ReactModal>
		</div>
	)
}

