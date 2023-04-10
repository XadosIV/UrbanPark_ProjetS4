import React, { useState, useEffect } from "react";
import axios from 'axios';
import { SearchUser } from "./search_user";
import { Separation } from "./separation";
import { TextField } from "@mui/material";

export function UserList() {

	const [usersList, setUsersList] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:3001/api/users").then((res) => 
			setUsersList(res.data)
		)}, []);

	const [inputTextUsers, setInputTextUsers] = useState("");

	let inputHandlerUsers = (e) => {
		var lowerCase = e.target.value.toLowerCase();
		setInputTextUsers(lowerCase);
	};

	return (<div className="UserList">
			<Separation value="Les utilisateurs"/>
			
			<TextField
				style = {{marginBottom:"20px", width:"200px", alignSelf:"center"}}
				id="searchbarUser"
				label="Rechercher..."
				type="text"
				name="searchbarUser"
				onChange={inputHandlerUsers}
			/>
			<SearchUser list={usersList} input={inputTextUsers}/>
		</div>)
}
