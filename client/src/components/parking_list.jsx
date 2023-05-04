import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { CutAddress, NeedS } from "../interface";
import { AdminVerif } from "../components"
import { DeleteParking } from "../services"
import { useLocation, useNavigate } from 'react-router-dom'

export function ParkingList(props) {

    const navigate = useNavigate();
    const location = useLocation();

    async function Callback(childData) {
        if (location.pathname.slice(0, -1) == "/parkings/") {
            navigate("/perso");
        }
        await DeleteParking(props.parking.id);
        props.handleCallback(childData)
    }

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
            <Link to={`/parkings/${props.parking.id}`} style={{textDecoration:"none"}}>
                <Button variant="contained" color="primary">Voir les places</Button>
            </Link>)
        }
    }

    var address = CutAddress(props.parking.address);

	return (
        <div className="list-item">	 
            <div>
                <h2>Parking {props.parking.name} ({props.parking.id})<br/>{props.parking.floors} étage{NeedS(props.parking.floors)}</h2>    
                <p>{address[0]}</p>
                <p>{address[1]}</p>
            </div>
            <div className="button-parking">               
                <p>{props.parking.nbPlaceLibre} places restantes / {props.parking.nbPlaceTot}</p> 
                {PutButton(props.button)}
                {props.admin && <AdminVerif title="Supprimer ce parking" text={"Vous êtes sur le point de supprimer le parking " + props.parking.name + " !"} handleCallback={Callback}/>}
            </div>
        </div>)
}
