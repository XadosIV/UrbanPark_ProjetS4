import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { CutAddress, NeedS } from "../interface";

export function ParkingList(parking) {
    /**
     * PutButton
     * Returns a button if value = true
     *
     * @param { boolean } value - Value if we want a button or not
     * @return { Link Button }
     */
    function PutButton(value) {
        if (value) {
            return (
            <Link to={`/parkings/${parking.parking.id}`} style={{textDecoration:"none"}}>
                <Button variant="contained" color="primary">Voir les places</Button>
            </Link>)
        }
    }

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
                {PutButton(parking.button)}
            </div>
        </div>)
}
