import React from "react";
import { useParams } from 'react-router-dom'
import {  } from "../components";
import { Button } from "@mui/material";
import "../css/admin.css"

export function ParkingSpots() {

    const name = useParams();
    console.log(name);

	return(<div>
        
		{name.parking}
	</div>)
}
