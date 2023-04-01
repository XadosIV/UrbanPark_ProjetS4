import React from "react";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { CutAddress } from "../CutAddress.js";
import { NeedS } from "../NeedS.js";

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
                <p>{parking.parking.nbPlaceLibre} / {parking.parking.nbPlaceTot}</p> 
                <Link to={`/${parking.parking.name}/places`}>
                    <Button variant="contained" color="primary" text-decoration="underline">Voir les places</Button>
                </Link>
            </div>
        </div>)
}