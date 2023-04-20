import React from "react";
import { useParams } from 'react-router-dom'
import { ParkingSpots, GoBack } from "../components";
import "../css/parking.css"

export function Parkings() {
    const id = useParams();

	return(<div>
        <GoBack />
        <ParkingSpots id={id} />
    </div>)
}
