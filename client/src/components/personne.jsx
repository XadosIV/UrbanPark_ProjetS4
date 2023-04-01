import React from "react";


export function Personne(info){

	const pers = info

	const test = pers.statut

	return (
		<div style={{color: test? 'red': 'black'}}>
			<p>nom: {pers.nom}</p>
			<p>prenom: {pers.prenom}</p>
		</div>
	)
}