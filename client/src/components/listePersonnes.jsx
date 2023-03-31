import React, { useEffect } from "react";
import { Personne } from "./";
import listPerson from "../services/listPerson"

export function ListePersonnes(nom) {
	useEffect(() => {
		const fetchData = async () => {
		  const data = await listPerson.takeAll(nom);
		}
	  
		// call the function
		fetchData()
		  // make sure to catch any error
		  .catch(console.error);
	  }, [])

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

	return (<div>
		<ul>
			{
				list.map((person, index) => (
					<Personne key={index} person={person} />
				))
			}
		</ul>
	</div>)
}