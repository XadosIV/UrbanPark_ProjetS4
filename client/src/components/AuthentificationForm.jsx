import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

export function AuthentificationForm() {
	const [mail, setMail] = useState("")
	const navigate = useNavigate();

	const handlleSubmit = (event) => {
		event.preventDefault();
		console.log(mail);
		if(mail === "connexion"){
			navigate("/connexion", {state: {mail: mail}});
		}else{
			navigate("/inscription", {state: {mail: mail}});
		}
	}

	return(<div>
		<form onSubmit={handlleSubmit}>
			<div>
				<TextField
				required
				id="authentification"
				label="mail"
				type="text"
				name="authentification"
				onChange={(e) => setMail(e.target.value)}
				/>
			</div>
			<Button variant="contained" color="primary" type="submit">Login</Button>
		</form>
	</div>)
}