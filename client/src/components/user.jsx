import React from "react";

/**
 * Composent of a User
 * @param { User } info
 * @return { Promise React.Component }
 */
export function User(info){

	const pers = info

	const test = pers.statut

	return (
		<div style={{color: test? 'red': 'black'}}>
			<p>nom: {pers.nom}</p>
			<p>prenom: {pers.prenom}</p>
		</div>
	)
}