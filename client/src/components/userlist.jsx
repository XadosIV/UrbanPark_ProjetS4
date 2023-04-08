import React, { useState } from "react";
import { SearchUser } from "./searchuser";
import { Separation } from "./separation";
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
			},{
				"id":2,
				"first_name": "Joris",
				"last_name": "Dubois",
				"email": "joris.dubois@gmail.fr",
				"role": "Abonné",
				"spot":7,
			},{
				"id":2,
				"first_name": "Joris",
				"last_name": "Dubois",
				"email": "joris.dubois@gmail.fr",
				"role": "Abonné",
				"spot":7,
			},{
				"id":2,
				"first_name": "Joris",
				"last_name": "Dubois",
				"email": "joris.dubois@gmail.fr",
				"role": "Abonné",
				"spot":7,
			},
		];
	
		const [inputTextUsers, setInputTextUsers] = useState("");
	
		let inputHandlerUsers = (e) => {
			var lowerCase = e.target.value.toLowerCase();
			setInputTextUsers(lowerCase);
		};
	
		return (<div>
				<Separation value="Les utilisateurs"/>
				
				<TextField
					style = {{"marginBottom":"20px", width:"200px", alignSelf:"center"}}
					id="searchbarUser"
					label="Rechercher..."
					type="text"
					name="searchbarUser"
					onChange={inputHandlerUsers}
				/>
				<SearchUser list={listUsers} input={inputTextUsers}/>
			</div>)
}
