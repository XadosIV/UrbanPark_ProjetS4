import React, { useEffect, useState } from "react";
import { Parking } from "./parking";
import { TakeParking } from "../services";

/**
 * Create a carroussel of Parking for the home page
 * @return { Promise React.Component }
 */
export function ParkingsHomePage() {

	const [ listParkings, setListParkings] = useState([]);
	
	/*
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
	*/

	useEffect(() => {
		async function fetchInfosParkings(){
			let resAllParkings = await TakeParking();
			console.log("resAllParkings", resAllParkings);
			setListParkings(resAllParkings);
		}
		fetchInfosParkings();
	}, []);

	return (<div className="caroussel">
		<div className="slides">
			{
				listParkings.map((parking, index) => (
					<Parking key={index} parking={parking} />
				))
			}
		</div>
	</div>)
}
