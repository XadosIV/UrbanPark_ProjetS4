import React, { useEffect, useState } from "react";
import { TakeAllSpots } from "../services";

/**
 * Composent of a Parking
 * @param { Parking } info
 * @return { Promise React.Component }
 */
export function Parking({parking}) {

	const [ allSpots, setAllspots ] = useState([]);
	const [ nbFreeSpots, setNbFreeSpots ] = useState(0);

	useEffect(() => {
		async function fetchAllSpots(id_park){
			let resAllSpots = await TakeAllSpots(id_park);
			setAllspots(resAllSpots);
		}
		fetchAllSpots(parking.id);
	}, [parking])

	useEffect(() => {
		let lambdaSpots_notInCLeaning = allSpots.filter(spot => !spot.types.includes("Abonné") && !spot.in_cleaning);
		setNbFreeSpots(lambdaSpots_notInCLeaning.length);
	}, [allSpots])

	return (
		<div className="slides-item">
			<h1>{ parking.name }</h1>
			<h3>{ parking.address }</h3>
			<p className="spot-counter" > { nbFreeSpots } / { allSpots.length }</p>
		</div>)
}

