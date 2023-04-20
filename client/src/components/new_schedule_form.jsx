import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { CreationSchedule, placeFromId } from "../services"
import { SpotName } from "../interface"
import Popup from 'reactjs-popup';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import "../css/parking.css"
import TAS from "../services/take_all_spots"
import TP from "../services/take_parking";
import TBR from "../services/take_by_role";

export function NewScheduleForm() {

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

    const [infos, setInfos] = useState({parking: "", user: [], date_start: new Date().toISOString().slice(0, 19), date_end: new Date().toISOString().slice(0, 19), first_spot: 0, last_spot:0});

	const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [spotsList, setSpotsList] = useState([])

    const [parkingsList, setParkingsList] = useState([]);
    const [serviceList, setServiceList] = useState([]);

    const handleChangeSelect = (selectedOptions, name) => {
        var value = [];
        if (selectedOptions.value) {
            if (name.name == "parking") {
                TAS.TakeAllSpots(selectedOptions.value).then(res => setSpotsList(res))
                setOptionsSpots(values => ({...values, change: true}))
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
        if (!Array.isArray(infos.user) || infos.user.length == 1) {
            if (Array.isArray(infos.user)) {
                infos.user = infos.user[0]
            }
            const res = await CreationSchedule(infos); 
            console.log(res);
            if (res.status === 200) {
                setWrongInput(true);
                if (infos.last_spot == infos.first_spot) {
                    placeFromId(infos.first_spot).then(res => {
                        setErrMessage("Place " + res.data[0].id_park + res.data[0].floor + "-" + res.data[0].number + "  bloquée pour être nettoyées")
                    })
                } else {
                    setWrongInput(true);
                    placeFromId(infos.first_spot).then(res => {
                        placeFromId(infos.last_spot).then(res2 => {
                            setErrMessage("Places " + res.data[0].id_park + res.data[0].floor + "-" + res.data[0].number + " à " + res2.data[0].id_park + res2.data[0].floor + "-" + res2.data[0].number + "  bloquées pour être nettoyée")
                        })
                    })
                }
            } else {
                setWrongInput(true);
                setErrMessage(res.data.message);
            }
        } else {
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
            if (scheduleAdded == stock.length) {
                if (infos.last_spot == infos.first_spot) {
                    setWrongInput(true);
                    placeFromId(infos.first_spot).then(res => {
                        setErrMessage("Place " + res.data[0].id_park + res.data[0].floor + "-" + res.data[0].number + "  bloquée pour être nettoyées")
                    })
                } else {
                    setWrongInput(true);
                    placeFromId(infos.first_spot).then(res => {
                        placeFromId(infos.last_spot).then(res2 => {
                            setErrMessage("Places " + res.data[0].id_park + res.data[0].floor + "-" + res.data[0].number + " à " + res2.data[0].id_park + res2.data[0].floor + "-" + res2.data[0].number + "  bloquées pour être nettoyée")
                        })
                    })
                }
            }
    
        }
	}

    var optionsService = AllServices(serviceList)
    var optionsParking = AllParkings(parkingsList)

    useEffect(() => {
        TP.TakeParking().then(res => {
            setParkingsList(res);
            TAS.TakeAllSpots(res[0].id).then(res => setSpotsList(res))
        });
        TBR.TakeByRole("Agent d'entretien").then(res => setServiceList(res))
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
            }}>Ajouter des créneaux de travail</Button>} position="right center" onClose={() => setWrongInput(false)}> 
            <div className="form_div">
                <h3 style={{textAlign:"center"}}>Ajout d'un nouveau créneau</h3>
                <form onSubmit={handlleSubmit} className="form">   
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
                            options={optionsService}
                            className="search-add-two "
                            onChange={handleChangeSelect}
                        />
                    </div>
                    <div className="numeros" style={{zIndex:1005}}>
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
                    </div>
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
                { wrongInput && <p className="err-message"> { errMessage } </p>}
            </div>
        </Popup>
    )
}
