import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { CutAddress, NeedS } from "../interface";

export function ParkingList(parking) {
    var address = CutAddress(parking.parking.address);

	return (
        <div className="list-item">	
            <div>
                <h2>{parking.parking.name}<br/>{parking.parking.floors} étage{NeedS(parking.parking.floors)}</h2>    
                <p>{address[0]}</p>
                <p>{address[1]}</p>
            </div>
            <div className="button-parking">               
                <p>{parking.parking.nbPlaceLibre} places restantes / {parking.parking.nbPlaceTot}</p> 
                <Link to={`/parkings/${parking.parking.name}`} style={{textDecoration:"none"}}>
                    <Button variant="contained" color="primary">Voir les places</Button>
                </Link>
            </div>
        </div>)
}
