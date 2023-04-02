import React, { useState, useEffect } from "react";
import { StaffPreview } from "./staffpreview";
import { Button, TextField } from "@mui/material";

export function SearchUser() {

	const [infos, setInfos] = useState(
		""
	)

	var listStaff = [
		{
            "id":1,
			"firstName": "Mathys",
			"lastName": "Aubert",
			"email": "mathys.aubert@free.fr",
            "role": "Gardien",
		},
		{
            "id":2,
			"firstName": "Joris",
			"lastName": "Dubois",
			"email": "joris.dubois@gmail.fr",
            "role": "Agent d'entretien",
		},
	];

	function GetSearch() {
		var str;
		var element = document.getElementById("searchbar");
		if (element != null) {
			str = element.value;
		} else {
			str = "";
		}
		
		console.log(str);
		useEffect(()=>{setInfos(str)});
		
	}

	return (<div>
            <div className="search-user">
                <div><h1>Rechercher un utilisateur</h1></div>
                <div className="search-box"><TextField
				id="searchbar"
				label="Rechercher..."
				type="text"
				name="searchbar"
			    /></div>
            </div>
			
            
			<br/><br/>
		</div>)
}
