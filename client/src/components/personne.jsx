import React, { useEffect } from "react";


export function Personne(person){

	const pers = person.person

	const test = pers.statut

	return (
		<li style={{color: test? 'red': 'black'}}>
			<p>nom: {pers.nom}</p>
			<p>prenom: {pers.prenom}</p>
		</li>
	)
}