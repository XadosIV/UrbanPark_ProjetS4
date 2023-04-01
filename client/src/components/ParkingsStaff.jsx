import React from "react";
import { ParkingList } from "./ParkingList";

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
		</div>)
}