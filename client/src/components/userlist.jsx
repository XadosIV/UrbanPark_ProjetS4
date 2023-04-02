import React, { useState, useEffect } from "react";
import { SearchUser } from "./searchuser";
import { TextField } from "@mui/material";

export function UserList() {

	var listUsers = [
		{
            "id":1,
			"first_name": "Mathys",
			"last_name": "Aubert",
			"email": "mathys.aubert@free.fr",
            "role": "Abonné",
			"spot":4,
		},
		{
            "id":2,
			"first_name": "Joris",
			"last_name": "Dubois",
			"email": "joris.dubois@gmail.fr",
            "role": "Abonné",
			"spot":7,
		},
	];

	const [inputTextUser, setInputTextUser] = useState("");

	let inputHandler = (e) => {
		var lowerCase = e.target.value.toLowerCase();
		setInputTextUser(lowerCase);
	};

	return (<div className="UserList">
            <h1>Rechercher un utilisateur</h1>

			<TextField
				id="searchbarUser"
				label="Rechercher..."
				type="text"
				name="searchbarUser"
				onchange={inputHandler}
			/>
			<br/><br/>
			<SearchUser list={listUsers} input={inputTextUser}/>
			<br/><br/>
		</div>)
}
