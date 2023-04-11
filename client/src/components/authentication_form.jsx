import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

export function AuthenticationForm() {
	const [mail, setMail] = useState("")
	const navigate = useNavigate();

	const handlleSubmit = (event) => {
		event.preventDefault();
		console.log(mail);
		if(mail === "connexion"){
			navigate("/connection", {state: {mail: mail}});
		}else{
			navigate("/registration", {state: {mail: mail}});
		}
	}

	return(<div>
		<form onSubmit={handlleSubmit}>
			<div>
				<TextField
					required
					id="authentication"
					label="mail"
					type="text"
					name="authentication"
					onChange={(e) => setMail(e.target.value)}
				/>
			</div>
			<Button 
				variant="contained" 
				color="primary" 
				type="submit"
			>Login</Button>
		</form>
	</div>)
}
