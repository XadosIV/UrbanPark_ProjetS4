import React from "react";
import { Parking } from "./Parking";

//Carousel of every parkings
export function ParkingsAccueil() {

	// Infos of eevry parkings, need to get it from database later
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


	return (<div className="caroussel">
		{/* <h1>Parkings</h1> */}
		<div className="slides">
			{
				listParkings.map((parking, index) => (
					<Parking key={index} parking={parking} />
				))
			}
		</div>
	</div>)
}