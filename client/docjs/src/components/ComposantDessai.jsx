import React from "react";

export function ComposantDessai(parking) {
	return (<div>
		<h1>Parking: {parking.nom}</h1>
		<p>Places disponibles: {parking.pdispo}</p>
		<p>Places total: {parking.ptot}</p>

		<p>calendrier: {parking.j}, {parking.m}, {parking.a}</p>

	</div>)
}