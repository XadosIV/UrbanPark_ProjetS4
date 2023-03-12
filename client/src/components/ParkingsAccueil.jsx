import React from "react";
import { Parking } from "./Parking";

export function ParkingsAccueil() {

	const listParkings = [
		{
			"nom": "parking1",
			"nbPlaceLibre": 29,
			"nbPlaceTot": 59,
		},
		{
			"nom": "parking2",
			"nbPlaceLibre": 18,
			"nbPlaceTot": 89,
		}
	];

	return (<div className="parkings">
		<h1>Parkings</h1>
		<ul>
			{
				listParkings.map((parking, index) => (
						<Parking key={index} parking={parking}/>
				))
			}
		</ul>
	</div>)
}