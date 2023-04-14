import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import TP from "../services/take_parking";
import TAS from "../services/take_all_spots";
import { Spot, ParkingList } from "../components"
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
        var opt = []
        for (let i=0; i<nb; i++) {
            opt.push({value:i.toString(), label:"Étage " + i.toString()})
        }
        return opt
    }

    const [parkingsList, setParkingsList] = useState([]);

    const [floor, setFloor] = useState();

    const [list, setList] = useState([]);

    const [textSelect, setTextSelect] = useState("Choisir un étage");

    const [inputTextSpotNumber, setInputTextSpotNumber] = useState("");

    var options = []
    parkingsList.map((parking) => (
        options = NbFloors(parking.floors)
    ))

    useEffect(() => {
		TP.TakeParking(props.name.parking).then(res => setParkingsList(res));
        console.log("Effect was run");
	}, []);

    useEffect(() => {
        console.log(parkingsList)
        parkingsList.map((parking) => (
            TAS.TakeAllSpots(parking.id).then(res => {setList(res); console.log(list)})
        ))
        console.log("Effect was run v2a");
    }, []);

    const handleChangeFloor = (e) => { 
        parkingsList.map((parking) => (
            TAS.TakeAllSpots(parking.id, e.value, inputTextSpotNumber).then(res => setList(res))
        ));
        setFloor(e.value);
        setTextSelect("Étage " + e.value);
    }

    const handleChangeNumber = (e) => {
        setInputTextSpotNumber(e.target.value.toString());
        parkingsList.map((parking) => (
            TAS.TakeAllSpots(parking.id, floor, e.target.value.toString()).then(res => setList(res))
        ));
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
                    onChange={handleChangeNumber}
                />
            </div>
        </div>
        <div className="all-spots">
            {
                list.map((spot) => (
                    <Spot spot={spot}/>
                ))
            }
		</div>
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
