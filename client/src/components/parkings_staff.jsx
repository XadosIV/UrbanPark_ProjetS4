import React, { useState, useEffect } from "react";
import { ParkingList } from "./parking_list";
import { Button } from "@mui/material";
import TP from "../services/take_parking"

export function ParkingsStaff() {

	const [parkingsList, setParkingsList] = useState([]);

	useEffect(() => {
		TP.TakeParking().then(res => {setParkingsList(res);})
	}, []);

	return (<div>
            <div className="title-parkings">
                <h1>Les parkings</h1>
            </div>
			<div className="parking-list">
				{
					parkingsList.map((parking, index) => (
						<ParkingList key={index} parking={parking} button={true}/>
					))
				}
			</div>
			<Button variant="contained" color="primary" 
			style={{
				backgroundColor: "#FE434C",
				borderColor: "transparent",
				borderRadius: 20,
				width: 250,
				float:"right",
				height:"120%"
			}}>Ajouter un parking</Button>	
		</div>)
}
