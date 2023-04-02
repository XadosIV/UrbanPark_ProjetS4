import React, { useState, useEffect } from "react";
import { StaffPreview } from "./staffpreview";
import { TextField } from "@mui/material";

export function StaffList() {

	var listStaff = [
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
            "role": "Agent d'entretien",
		},
	];

	const [inputTextStaff, setInputTextStaff] = useState("");

	let inputHandler = (e) => {
		var lowerCase = e.target.value.toLowerCase();
		setInputTextStaff(lowerCase);
	};

	return (<div className="StaffList">
            <h1>Le personnel</h1>
			
            <TextField
				id="searchbarStaff"
				label="Rechercher..."
				type="text"
				name="searchbarStaff"
				onChange={inputHandler}
			/>
			<br/><br/>
			<StaffPreview list={listStaff} input={inputTextStaff}/>
		</div>)
}
