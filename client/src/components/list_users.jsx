import React from "react";
import ReactDOM from 'react-dom';
import { List, User } from ".";
import { CreateListPerson } from "../interface"

/**
 * Use the component List to create a liste of person according to the name of their role
 * @param { String } nom
 * @return { Promise React.Component }
 */
export function ListUsers(nom) {
	const data = CreateListPerson(nom)
		.catch(console.error);

	const list = [
		{
			"first_name":"Jean",
			"name":"Dupond",
			"email":"my.email@itsamail.com",
			"id_place":1, // Can be null
			"role":"Gardien",
			"status": false,
		},
		{
			"name": "maquie",
			"first_name": "poqui",
			"email":"my.email@itsamail.com",
			"id_place":null, // Can be null
			"role":"Gardien",
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
		List(User, affichePlanning, list)
	)
}