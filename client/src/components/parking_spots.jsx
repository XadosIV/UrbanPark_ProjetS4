import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import TP from "../services/take_parking";
import TAS from "../services/take_all_spots";
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

    const [parkingsList, setParkingsList] = useState([]);

    const [floor, setFloor] = useState("%");

    const [list, setList] = useState([]);

    const [textSelect, setTextSelect] = useState("Choisir un étage");

    const [inputTextSpotNumber, setInputTextSpotNumber] = useState(0);

    var options = []
    parkingsList.map((parking) => (
        options = NbFloors(parking.floors)
    ))

    useEffect(() => {
		TP.TakeParking(props.name.parking).then(res => setParkingsList(res));
        TAS.TakeAllSpots(parkingsList[0]).then(res => setList(res));
	}, []);

    const handleChangeFloor = (e) => {
        setFloor(e.value); 
        if (e.value == "%") {
            setTextSelect("Tous les étages");
        } else {
            setTextSelect("Étage " + e.value);
        }
    }

	return(<div>
        <div className="title-parking">
            <h1>Parking {props.name.parking}</h1>
        </div>
        {
            parkingsList.map((parking) =>
                <ParkingList parking={parking} button={false}/>
            )
        }
        <div style={{width:"420px", display:"flex", flexDirection:"row", justifyContent:"space-between"}}> 
            <div className="search">
                <Select options={options} placeholder={textSelect} value={floor} onChange={handleChangeFloor}/>
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
        </div>
        <SpotsList list={list} inputFloor={floor} inputNumber={inputTextSpotNumber}/>
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
