import React, { useState, useEffect } from "react";
import { StaffPreview } from "./staffpreview";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";

export function StaffList() {

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

	const [inputText, setInputText] = useState("");

	let inputHandler = (e) => {
		var lowerCase = e.target.value.toLowerCase();
		setInputText(lowerCase);
	};

	return (<div>
            <div className="">
                <h1>Le personnel</h1>
            </div>
			
            <TextField
				id="searchbar"
				label="Rechercher..."
				type="text"
				name="searchbar"
				onChange={inputHandler}
			/>
			<br/><br/>
			<StaffPreview list={listStaff} input={inputText}/>
		</div>)
}
