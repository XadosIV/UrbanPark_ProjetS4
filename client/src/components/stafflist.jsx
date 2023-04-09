import React, { useState } from "react";
import { StaffPreview } from "./staffpreview";
import { Separation } from "./separation";
import { TextField, Button } from "@mui/material";

export function StaffList() {

	var listGuardians = [
		{
            "id":1,
			"first_name": "Mathys",
			"last_name": "Aubert",
			"email": "mathys.aubert@free.fr",
            "role": "Gardien",
		},
		{
            "id":2,
			"first_name": "Joris",
			"last_name": "Dubois",
			"email": "joris.dubois@gmail.fr",
            "role": "Gardien",
		},
		{
            "id":2,
			"first_name": "Joris",
			"last_name": "Dubois",
			"email": "joris.dubois@gmail.fr",
            "role": "Gardien",
		},
		{
            "id":2,
			"first_name": "Joris",
			"last_name": "Dubois",
			"email": "joris.dubois@gmail.fr",
            "role": "Gardien",
		},
		{
            "id":2,
			"first_name": "Joris",
			"last_name": "Dubois",
			"email": "joris.dubois@gmail.fr",
            "role": "Gardien",
		},
	];

	var listService = [
		{
            "id":4,
			"first_name": "JP",
			"last_name": "Aubert",
			"email": "mathys.aubert@free.fr",
            "role": "Agent d'entretien",
		},
		{
            "id":7,
			"first_name": "Aha",
			"last_name": "Dubois",
			"email": "joris.dubois@gmail.fr",
            "role": "Agent d'entretien",
		},{
            "id":7,
			"first_name": "Aha",
			"last_name": "Dubois",
			"email": "joris.dubois@gmail.fr",
            "role": "Agent d'entretien",
		},{
            "id":7,
			"first_name": "Aha",
			"last_name": "Dubois",
			"email": "joris.dubois@gmail.fr",
            "role": "Agent d'entretien",
		},{
            "id":7,
			"first_name": "Aha",
			"last_name": "Dubois",
			"email": "joris.dubois@gmail.fr",
            "role": "Agent d'entretien",
		},
	];

	const [inputTextGuadrians, setInputTextGuardians] = useState("");

	let inputHandlerGuardians = (e) => {
		var lowerCase = e.target.value.toLowerCase();
		setInputTextGuardians(lowerCase);
	};

	const [inputTextService, setInputTextService] = useState("");

	let inputHandlerService = (e) => {
		var lowerCase = e.target.value.toLowerCase();
		setInputTextService(lowerCase);
	};

	return (<div className="StaffList">
			<Separation value="Les gardiens"/>
			
			<TextField
				style = {{"marginBottom":"20px", width:"200px", alignSelf:"center"}}
				id="searchbarStaff"
				label="Rechercher..."
				type="text"
				name="searchbarStaff"
				onChange={inputHandlerGuardians}
			/>
			<StaffPreview list={listGuardians} input={inputTextGuadrians}/>
			<Separation value="Les agents d'entretien"/>
			
			<TextField
				style = {{"marginBottom":"20px", width:"200px", alignSelf:"center"}}
				id="searchbarStaff"
				label="Rechercher..."
				type="text"
				name="searchbarStaff"
				onChange={inputHandlerService}
			/>
			<StaffPreview list={listService} input={inputTextService}/>
		</div>)
}
