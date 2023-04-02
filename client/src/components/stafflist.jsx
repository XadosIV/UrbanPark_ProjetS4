import React, { useState, useEffect } from "react";
import { StaffPreview } from "./staffpreview";
import { Button, TextField } from "@mui/material";

export function StaffList() {

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
            <div className="">
                <h1>Le personnel{infos}</h1>
            </div>
			
            <TextField
				id="searchbar"
				label="Search staff..."
				type="text"
				name="searchbar"
				onChange={GetSearch()}
			/>
			{
                listStaff.map((staff, index) => (
					<StaffPreview key={index} staff={staff}/>
				))
			}
		</div>)
}
