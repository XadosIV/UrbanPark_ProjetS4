import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { CutAddress, NeedS } from "../interface";
import { Button } from "@mui/material";
import TP from "../services/take_parking";
import { SpotsList } from "../components"
import "../css/parking.css"

export function ParkingSpots() {

    const name = useParams();

    const [parkingsList, setParkingsList] = useState([]);

    useEffect(() => {
		TP.TakeParking(name.parking).then(res => setParkingsList(res))
	}, []);

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
                            <p>{parking.nbPlaceLibre} places libres / {parking.nbPlaceTot}</p> 
                        </div>
                    </div>
                    
                ))
            }
            {
                parkingsList.map((parking) => (
                    <SpotsList id={parking.id}/>
                ))
            }
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
