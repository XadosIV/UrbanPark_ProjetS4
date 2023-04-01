import React from "react";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { cutAddress } from "../cutAddress.js";

export function ParkingList(parking) {
    var address = cutAddress(parking.parking.address);
	return (
        <div className="list-item">	
            <div>
                <h2>{parking.parking.nom}</h2>
                <p>{address[0]}</p>
                <p>{address[1]}</p>
            </div>
            <div className="button-parking">
                <p>{parking.parking.nbPlaceLibre} / {parking.parking.nbPlaceTot}</p> 
                <Link to={`/${parking.parking.nom}/places`}>
                    <Button variant="contained" color="primary" text-decoration="underline">Voir les places</Button>
                </Link>
            </div>
        </div>)
}