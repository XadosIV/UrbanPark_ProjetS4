import React, { useState, useEffect } from "react";
import { SearchUser } from "./search_user";
import { Separation } from "./separation";
import { TextField } from "@mui/material";
import { InputHandler } from "../interface"
import { TakeByRole } from "../services"

export function UserList() {

	const [usersList, setUsersList] = useState([]);

	useEffect(() => {
		TakeByRole("Abonné").then(res => {setUsersList(res);})
	}, []);

	const [inputTextUsers, setInputTextUsers] = useState("");

	return (<div className="UserList">
			<Separation value=" Tous les abonnés"/>
			
			<TextField
				style = {{marginBottom:"20px", width:"200px", alignSelf:"center"}}
				id="searchbarUser"
				label="Rechercher..."
				type="text"
				name="searchbarUser"
				onChange={InputHandler(setInputTextUsers)}
			/>
			<SearchUser list={usersList} input={inputTextUsers}/>
		</div>)
}
