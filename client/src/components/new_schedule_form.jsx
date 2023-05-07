import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { CreationSchedule, placeFromId, TakeAllSpots, TakeParking, TakeByRole } from "../services"
import { SpotName, NeedS } from "../interface"
import Popup from 'reactjs-popup';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import "../css/parking.css"

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
        for (let i=0; i<list.length; i++) {
            opt.push({value:list[i].id, label:"Place " + SpotName(list[i])})
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

    const [optionsSpots, setOptionsSpots] = useState({opts:[], change:true})
    const [optionsUsers, setOptionsUsers] = useState({opts:[], change:false})

    const [infos, setInfos] = useState({parking: "", user: [], date_start: new Date().toISOString().slice(0, 19), date_end: new Date().toISOString().slice(0, 19)});

	const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [spotsList, setSpotsList] = useState([])

    const [parkingsList, setParkingsList] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [guardiansList, setGuardiansList] = useState([]);

    const [editable, setEditable] = useState(true)

    const handleChangeSelect = (selectedOptions, name) => {
        var value = [];
        if (selectedOptions.value) {
            if (name.name === "parking") {
                TakeAllSpots(selectedOptions.value).then(res => setSpotsList(res))
                setOptionsSpots(values => ({...values, change: true}))
            } else if (name.name === "type") {
                setOptionsUsers(values => ({...values, opts:AllServices(eval(selectedOptions.value)), change: true}))
                setEditable(false)
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
        var isSubmit = false;
        if (infos.user.length === 0) {
            setWrongInput(true)
            setErrMessage("Vous n'avez assigné ce créneau à personne")
        } else {
            if (!Array.isArray(infos.user)) {
                infos.user = [infos.user]
            }
            var stock = infos.user;
            var scheduleAdded = 0;
            for (let user of stock) {
                infos.user = user;
                const res = await CreationSchedule(infos); 
                console.log(res);
                if (res.status === 200) {
                    scheduleAdded++;
                } else {
                    setWrongInput(true);
                    setErrMessage(res.data.message);
                    break;
                }
            }
            if (scheduleAdded === stock.length) {
                infos.user = stock
                if (optionsUsers === AllServices(serviceList)) {
                    if (infos.last_spot === infos.first_spot) {
                        placeFromId(infos.first_spot).then(res => {
                            setErrMessage("Place " + res.data[0].id_park + res.data[0].floor + "-" + res.data[0].number + "  bloquée pour être nettoyée");
                            isSubmit = true;
                        })
                    } else {
                        placeFromId(infos.first_spot).then(res => {
                            placeFromId(infos.last_spot).then(res2 => {
                                setErrMessage("Places " + res.data[0].id_park + res.data[0].floor + "-" + res.data[0].number + " à " + res2.data[0].id_park + res2.data[0].floor + "-" + res2.data[0].number + "  bloquées pour être nettoyées");
                                isSubmit = true;
                            })
                        })
                    }
                } else {
                    TakeParking(infos.parking).then(res => {
                        setErrMessage("Parking " + res[0].name + " supervisé par " + infos.user.length + " gardien" + NeedS(infos.user.length) + " de " + infos.date_start.replace('T', ' ') + " à " + infos.date_end.replace('T', ' '));
                    })
                    isSubmit = true;
                }
            }
        }
        if (isSubmit) {
            setWrongInput(true);
            props.handleCallback(false)
        }
	}

    var optionsParking = AllParkings(parkingsList)
    const newScheduleOptions = [{value:"guardiansList", label: "Gardien"}, {value:"serviceList", label:"Agent d'entretien"}]

    useEffect(() => {
        TakeParking().then(res => {
            setParkingsList(res);
            TakeAllSpots(res[0].id).then(res => setSpotsList(res))
        });
        TakeByRole("Agent d'entretien").then(res => setServiceList(res))
        TakeByRole("Gardien").then(res => setGuardiansList(res))
    }, [])

    useEffect(() => {
        setOptionsSpots({opts:AllSpots(spotsList), change:false})
    }, [optionsSpots.change])

    return (
        <Popup trigger={<Button variant="contained" color="primary" 
            style={{
                backgroundColor: "#FE434C",
                borderColor: "transparent",
                borderRadius: 20,
                width: "16%",
                marginLeft: "42%",
                height:"100px",
                marginBottom:"100px"
            }}>Ajouter des créneaux de travail</Button>} position="right center" onClose={() => {setWrongInput(false); setEditable(true); setInfos({parking: "", user: [], date_start: new Date().toISOString().slice(0, 19), date_end: new Date().toISOString().slice(0, 19)}); setOptionsUsers({opts:[], change:false});}}> 
            <div className="form_div">
                <h3 style={{textAlign:"center"}}>Ajout d'un nouveau créneau</h3>
                <form onSubmit={handlleSubmit} className="form"> 
                    <div style={{zIndex:1008}}>
                        <Select 
                            isDisabled={!editable}
                            id="type"
                            className="searchs-add"
                            options={newScheduleOptions} 
                            placeholder="Type de créneau..."
                            name="type" 
                            isSearchable={false}
                            onChange={handleChangeSelect}
                        />
                    </div>  
                    <div style={{zIndex:1007}}>   
                        <Select 
                            id="parking"
                            className="searchs-add"
                            options={optionsParking} 
                            placeholder="Choisir un parking..."
                            name="parking" 
                            isSearchable={false}
                            onChange={handleChangeSelect}
                        />
                    </div> 
                    <div style={{zIndex:1006}}>  
                        <Select
                            isMulti
                            name="user"
                            placeholder="Assigner à..."
                            options={optionsUsers.opts}
                            className="search-add-two "
                            onChange={handleChangeSelect}
                        />
                    </div>
                    {JSON.stringify(optionsUsers.opts) === JSON.stringify(AllServices(serviceList)) && <div className="numeros" style={{zIndex:1005}}>
                        <Select
                            options={optionsSpots.opts}
                            style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
                            size="small"
                            id="first_spot"
                            label="Numéro"
                            type="text"
                            name="first_spot"
                            className="search"
                            onChange={handleChangeSelect}
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
                            className="search"
                            onChange={handleChangeSelect}
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
                        className="submit_button" 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                    >Ajouter</Button>
                </form>
                { wrongInput && <p className="err-message" style={{maxWidth:"450px"}}> { errMessage } </p>}
            </div>
        </Popup>
    )
}

