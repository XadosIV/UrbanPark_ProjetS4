import React from "react";
import { useParams } from 'react-router-dom'
import { ParkingSpots } from "../components";
import "../css/parking.css"

export function Parkings() {
    const id = useParams();

	return(
        <ParkingSpots id={id} />
    )
}
