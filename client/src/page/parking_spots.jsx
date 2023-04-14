import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { CutAddress, NeedS } from "../interface";
import { Button } from "@mui/material";
import TP from "../services/take_parking";
import TAS from "../services/take_all_spots";
import { SpotsList } from "../components";
import Select from 'react-select';
import "../css/parking.css"

export function ParkingSpots() {

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

    const name = useParams();

    const [parkingsList, setParkingsList] = useState([]);

    const [floor, setFloor] = useState(-1);

    const [list, setList] = useState([]);

    const [textSelect, setTextSelect] = useState("Choisir un étage");

    var options = []
    parkingsList.map((parking) => (
        options = NbFloors(parking.floors)
    ))

    useEffect(() => {
		TP.TakeParking(name.parking).then(res => setParkingsList(res))
	}, []);

    useEffect(() => {
        parkingsList.map((parking) => (
            TAS.TakeAllSpots(parking.id).then(res => setList(res))
        ))
    }, []);

    const handleChange = (e) => { 
        parkingsList.map((parking) => (
            TAS.TakeAllSpots(parking.id, e.value).then(res => setList(res))
        ));
        setFloor(e.value);
        setTextSelect("Étage " + e.value);
    }

	return(<div>
        <div className="title-parking">
            <h1>Parking {name.parking}</h1>
        </div>
            {
                parkingsList.map((parking) => (
                    <div className="parking-item">	
                        <div>
                            <h2>{parking.floors} étage{NeedS(parking.floors)}</h2>    
                            <p>{CutAddress(parking.address)[0]}</p>
                            <p>{CutAddress(parking.address)[1]}</p>
                        </div>
                        <div className="button-parking">               
                            <p>0 places restantes / 0</p> 
                        </div>
                    </div>        
                ))
            }
        <div style={{width:"200px", marginBottom:"10px"}}>
            <Select options={options} placeholder={textSelect} value={floor} onChange={handleChange}/>
        </div>
        <SpotsList list={list}/>
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
