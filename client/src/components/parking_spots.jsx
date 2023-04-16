import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import TP from "../services/take_parking";
import TAS from "../services/take_all_spots";
import TAST from "../services/take_all_spot_types"
import { SpotsList, ParkingList } from "../components";
import { InputHandler } from "../interface"
import Select from 'react-select';
import "../css/parking.css"

export function ParkingSpots(props) {

    /**
     * NbFloors
     * Returns a lists of options for a Select React component composed of every floor 
     *
     * @param { integer } nb - Number of floors in the parking
     * @return { Array }
     */
    function NbFloors(nb) {
        var opt = [{value:"%", label:"Tous les étages"}]
        for (let i=0; i<nb; i++) {
            opt.push({value:i.toString(), label:"Étage " + i.toString()})
        }
        return opt
    }

    /**
     * AllTypes
     * Returns a lists of options for a Select React component composed of every type 
     *
     * @param { Array } list - List of types in the parking
     * @return { Array }
     */
    function AllTypes(list) {
        var opt = [{value:"%", label:"Tous les types"}]
        for (let i=0; i<list.length; i++) {
            opt.push({value:list[i].name.toLowerCase(), label:"Type " + list[i].name.toLowerCase()})
        }
        return opt
    }

    const [parkingsList, setParkingsList] = useState([]);

    const [list, setList] = useState([]);

    const [floor, setFloor] = useState("%");

    const [textSelectFloor, setTextSelectFloor] = useState("Choisir un étage");

    const [inputTextSpotNumber, setInputTextSpotNumber] = useState(0);

    const [type, setType] = useState("%");

    const [spotTypes, setSpotTypes] = useState([]);

    const [textSelectType, setTextSelectType] = useState("Choisir un type");
    
    useEffect(() => {
		TP.TakeParking(props.name.parking).then(res => setParkingsList(res));
        TAS.TakeAllSpots(parkingsList[0]).then(res => setList(res));
        TAST.TakeAllSpotTypes().then(res => setSpotTypes(res));
	}, []);

    var optionsFloor = []
    parkingsList.map((parking) => (
        optionsFloor = NbFloors(parking.floors)
    ))

    var optionsType = AllTypes(spotTypes)

    let handleChange = (funText, funSet, text) => { 
        return (e) => {
            funSet(e.value); 
            if (e.value == "%") {
                funText("Tous les " + text.toLowerCase());
            } else {
                funText(text.substring(0, text.length - 1) + " " + e.value);
            }
        }
    }

	return(<div>
        <div className="title-parking">
            <h1>Parking {props.name.parking}</h1>
        </div>
        <div style={{marginBottom:"30px"}}>
            {
                parkingsList.map((parking) =>
                    <ParkingList parking={parking} button={false}/>
                )
            }
        </div>
        <div style={{width:"630px", display:"flex", flexDirection:"row", justifyContent:"space-between"}}> 
            <div className="search">
                <Select options={optionsFloor} placeholder={textSelectFloor} value={floor} onChange={handleChange(setTextSelectFloor, setFloor, "Étages")}/>
            </div>
            <div className="search">
                <TextField
                    style = {{marginBottom:"20px", width:"200px", alignSelf:"center"}}
                    size="small"
                    id="searchbarUser"
                    label="Numéro de la place..."
                    type="text"
                    name="searchbarUser"
                    onChange={InputHandler(setInputTextSpotNumber)}
                />
            </div>
            <div className="search">
                <Select options={optionsType} placeholder={textSelectType} value={type} onChange={handleChange(setTextSelectType, setType, "Types")}/>
            </div>
        </div>
        <SpotsList list={list} inputFloor={floor} inputNumber={inputTextSpotNumber} inputType={type}/>
        <Button variant="contained" color="primary" 
        style={{
            backgroundColor: "#FE434C",
            borderColor: "transparent",
            borderRadius: 20,
            width: 250,
            float:"right",
            height:"10%",
            marginBottom:"50px"
        }}>Ajouter des places</Button>	
    </div>)
}
