import React from "react";
import { ParkingList } from "./parkinglist";
import { Button } from "@mui/material";

export function ParkingsStaff() {

	//Has to be the list where we get all the parkings
	const listParkings = [
		{
			"name": "parking1",
			"nbPlaceLibre": 29,
			"nbPlaceTot": 59,
            "floors":2,
            "address": "4 rue des fleurs 73000 Chambéry",
		},
		{
			"name": "parking2",
			"nbPlaceLibre": 18,
			"nbPlaceTot": 89,
            "floors":1,
            "address": "7 rue des champignons 73470 Novalaise",
		},
		{
			"name": "parking3",
			"nbPlaceLibre": 1,
			"nbPlaceTot": 2,
            "floors":7,
            "address": "7 allée des allobroges 73470 Novalaise",
		}	,
		{
			"name": "parking4",
			"nbPlaceLibre": 2,
			"nbPlaceTot": 78,
            "floors":45,
            "address": "7 allée des ahahaha 45780 Saint-Jean sur Terre",
		}		
	];

	return (<div>
            <div className="title-parkings">
                <h1>Les parkings</h1>
            </div>
			<div className="parking-list">
				{
					listParkings.map((parking, index) => (
						<ParkingList key={index} parking={parking}/>
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
