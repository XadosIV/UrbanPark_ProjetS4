import React from "react";

/**
 * Composent of a Parking
 * @param { Parking } info
 * @return { Promise React.Component }
 */

export function Parking(parking) {

	return (
		<div className="slides-item">
			<h1>{parking.parking.nom}</h1>
			<p>{parking.parking.nbPlaceLibre} / {parking.parking.nbPlaceTot}</p>
		</div>)
}

