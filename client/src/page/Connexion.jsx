import React, { useState } from "react";
import { ExampleName } from "../components";
import authAPI from "../services/authAPI";

import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";

export function Connexion() {
	const [infos, setInfos] = useState({
		identifier: "",
		password:""
	})

	const handleChange = ({currentTarget}) => {
		const {value, name} = currentTarget;
		setInfos({
			...infos,
			[name]: value
		})
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		try{
			await authAPI.authenticate(infos)
		} catch(error){
			console.log(error)
		}
	}

	return(<div>
		<form onSubmit={handleSubmit}>
			<div>
				<TextField
				id="identifier"
				label="Username"
				type="text"
				name="identifier"
				onChange={handleChange}
				/>
				<TextField
				id="password"
				label="Password"
				type="text"
				name="password"
				onChange={handleChange}
				/>
			</div>
			<Button variant="contained" color="primary" type="submit">Login</Button>
		</form>
	</div>)
}