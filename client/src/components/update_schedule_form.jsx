import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { UpdateSchedule, placeFromId, DeleteSchedule } from "../services"
import { SpotName } from "../interface"
import Popup from 'reactjs-popup';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import "../css/parking.css"
import TAS from "../services/take_all_spots"
import TP from "../services/take_parking";
import TBR from "../services/take_by_role";

export function UpdateScheduleForm(props) {

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

    const [infos, setInfos] = useState({parking: props.event.idparking, user: props.event.user, date_start: props.event.d_st, date_end: props.event.d_en, first_spot: props.event.first_spot, last_spot:props.event.last_spot});

	const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const [parkingsList, setParkingsList] = useState([]);
    const [serviceList, setServiceList] = useState([]);

    const handleChangeSelect = (selectedOptions, name) => {
        var value = [];
        if (selectedOptions.value) {
            if (name.name == "parking") {
                TAS.TakeAllSpots(selectedOptions.value).then(res => {
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
        if (!(infos.parking == props.event.idparking && infos.user == props.event.user && infos.date_start == props.event.d_st && infos.date_end == props.event.d_en && infos.first_spot == props.event.first_spot && infos.last_spot == props.event.last_spot)) {
            var scheduleAdded = 0;
            let stock = infos.user
            for (let i=0; i<props.event.user.length; i++) {
                var fun;
                infos.user = stock[i]
                if (props.event.user.includes(stock[i])) {
                    fun = UpdateSchedule(infos, props.event.id_schedule[i]);
                } else {
                    fun = DeleteSchedule(props.event.id_schedule[i]);
                }
                const res = await fun
                if (res.status === 200) {
                    scheduleAdded++;
                } else {
                    setWrongInput(true);
                    setErrMessage(res.data.message);
                    break;
                }
            }
            if (scheduleAdded == props.event.user.length) {
                if (infos.last_spot == infos.first_spot) {
                    setWrongInput(true);
                    placeFromId(infos.first_spot).then(res => {
                        setErrMessage("Place " + res.data.id_park + res.data.floor + "-" + res.data.number + "  bloquée pour être nettoyées")
                    })
                } else {
                    setWrongInput(true);
                    placeFromId(infos.first_spot).then(res => {
                        placeFromId(infos.last_spot).then(res2 => {
                            setErrMessage("Places " + res.data.id_park + res.data.floor + "-" + res.data.number + " à " + res2.data.id_park + res2.data.floor + "-" + res2.data.number + "  bloquées pour être nettoyée")
                        })
                    })
                }
            }
        } else {
            setWrongInput(true);
            setErrMessage("Vous n'avez rien modifié");
        }
    }

    var optionsService = AllServices(serviceList)
    var optionsParking = AllParkings(parkingsList)

    useEffect(() => {
        TP.TakeParking().then(res => setParkingsList(res));
        TAS.TakeAllSpots(infos.parking).then(res => {
            setOptionsSpots({opts:AllSpots(res), change:false});
        });
        TBR.TakeByRole("Agent d'entretien").then(res => setServiceList(res));
    }, [])

    useEffect(() => {
        TAS.TakeAllSpots(infos.parking).then(res => {
            setOptionsSpots({opts:AllSpots(res), change:false})
        })
    }, [optionsSpots.change])

    function BaseParking(id_park, list) {
        for (let parking of list) {
            if (parking.id == id_park) {      
                return "Parking " + parking.name.toLowerCase();
            }
        }
    }

    function BaseUser(id_user, list) {
        var opts=[]
        if (!Array.isArray(id_user)) {
            id_user = [id_user]
        }
        for (let user of list) {
            for (let id of id_user) {
                if (user.id == id) {
                    for (let opt of optionsService) { 
                        if (opt.value == user.id) {
                            opts.push(opt);
                        }
                    }
                }
            }
        }
        return opts
    }

    function BaseSpot(spot, list) {
        var opts=[]
        for (let s of list) {
            if (s.value == spot) {
                opts.push(s);
            }
        }
        return opts
    }

    return (
        <Popup trigger={<Button variant="contained" color="primary" 
            style={{
                backgroundColor: "#FE434C",
                borderColor: "transparent",
                borderRadius: 20,
                width:"300px",
                height:"100px",
                margin:"10px 0 0 170px"
            }}>Modifier : {props.event.title}</Button>} position="right center" onClose={() => setWrongInput(false)}> 
            <div className="form_div">
                <h3 style={{textAlign:"center"}}>Modification du créneau :</h3>
                <form onSubmit={handlleSubmit} className="form">   
                    <div style={{zIndex:1007}}>   
                        <Select 
                            id="parking"
                            className="searchs-add"
                            options={optionsParking} 
                            placeholder={BaseParking(infos.parking, parkingsList)}
                            name="parking" 
                            isSearchable={false}
                            onChange={handleChangeSelect}
                        />
                    </div> 
                    <div style={{zIndex:1006}}>  
                        <Select
                            isMulti
                            name="user"
                            defaultValue={BaseUser(infos.user, serviceList)}
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
                            defaultValue={BaseSpot(infos.first_spot, optionsSpots.opts)}
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
                            defaultValue={BaseSpot(infos.last_spot, optionsSpots.opts)}
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
                    >Modifier</Button>
                </form>
                { wrongInput && <p className="err-message"> { errMessage } </p>}
            </div>
        </Popup>
    )
}

