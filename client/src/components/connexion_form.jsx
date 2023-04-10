import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

export function ConnexionForm(props) {
	const [infos, setInfos] = useState({mail: props.mail, password: ""})
	const navigate = useNavigate();

	const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }


	const handlleSubmit = (event) => {
		event.preventDefault();
		console.log(infos);
		if(infos.password === "password"){
			navigate("/", {state: {auth: true}});
		}
	}

	return(<div>
		<form onSubmit={handlleSubmit}>
			<div>
			<TextField
				required
				id="mail"
				label="mail"
				type="text"
				name="mail"
				defaultValue={props.mail}
				onChange={handleChange}
			/>
			<TextField
				required
				id="password"
				label="mot de passe"
				type="password"
				name="password"
				onChange={handleChange}
			/>
			</div>
			<Button 
				variant="contained" 
				color="primary" 
				type="submit"
			>connexion</Button>
		</form>
	</div>)
}
