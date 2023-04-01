import React, { useEffect } from "react";
import ReactDOM from 'react-dom';
import { Liste, Personne } from "./";
import { creaListPerson } from "../interface"

export function ListePersonnes(nom) {
	const data = creaListPerson(nom)
		.catch(console.error);

	const list = [
		{
			"nom": "Muati",
			"prenom": "paqui",
			"statut": false,
		},
		{
			"nom": "maquie",
			"prenom": "poqui",
			"statut": true,
		}
	];

	function affichePlanning () {
		const element = (
			<div>
			  <h1>Bonjour, monde !</h1>
			  <h2>Il est {new Date().toLocaleTimeString()}.</h2>
			</div>
		  );
		  ReactDOM.render(element, document.getElementById('container'));
	}

	return (
		Liste(Personne, affichePlanning, list)
	)
}