import React from "react";
// Test with parking name and random values
// Corresponds to a single parking in the slide of all parkings
export function Parking(parking) {

	return (<div className="parking">
		<li>
			<h1>{parking.parking.nom}</h1>
			<p>{parking.parking.nbPlaceLibre} / {parking.parking.nbPlaceTot}</p>
		</li>
	</div>)
}