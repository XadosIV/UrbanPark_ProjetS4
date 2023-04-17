import React, { useState, useEffect } from "react";
import { SearchUser } from "./search_user";
import { Separation } from "./separation";
import { TextField } from "@mui/material";
import { InputHandler } from "../interface"
import TBR from "../services/take_by_role"

export function UserList() {

	const [usersList, setUsersList] = useState([]);

	useEffect(() => {
		TBR.TakeByRole().then(res => {setUsersList(res);})
	}, []);

	const [inputTextUsers, setInputTextUsers] = useState("");

	return (<div className="UserList">
			<Separation value="Les utilisateurs"/>
			
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
