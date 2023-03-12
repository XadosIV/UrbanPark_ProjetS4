import React from "react";

export function Parking(parking) {

	return (<div className="parking">
		<li>
			<h1>{parking.parking.nom}</h1>
			<p>{parking.parking.nbPlaceLibre} / {parking.parking.nbPlaceTot}</p>
		</li>
	</div>)
}