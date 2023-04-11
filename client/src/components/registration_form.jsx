import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { creationCompte } from "../services/creation_compte";
import { Navigate } from "react-router-dom";

export function RegistrationForm(props) {
	const [infos, setInfos] = useState({email: props.mail, first_name: "", last_name: "", password: "", password_conf: ""});
	const [wrongPassword, setWrongPassword] = useState(false);

	const handlleSubmit = async (event) => {
		event.preventDefault();
		console.log(infos);
		if(infos.password !== infos.password_conf){
			setWrongPassword(true);
		}else{
			setWrongPassword(false);
			const res = await creationCompte(infos);
			console.log(res);
			Navigate("/");
		}
	}

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

	return(<div>
		<form onSubmit={handlleSubmit}>
			<div>
                <TextField
					required
					id="email"
					label="email"
					type="text"
					name="email"
					defaultValue={props.mail}
					onChange={handleChange}
				/>
				<TextField
					required
					id="first_name"
					label="first_name"
					type="text"
					name="first_name"
					onChange={handleChange}
				/>
                <TextField
					required
					id="last_name"
					label="last_name"
					type="text"
					name="last_name"
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
                <TextField
					required
					id="password_conf"
					label="confirmation du mot de passe"
					type="password"
					name="password_conf"
					onChange={handleChange}
				/>
			</div>
			<Button 
				variant="contained" 
				color="primary" 
				type="submit"
			>inscription</Button>
		</form>
		{ wrongPassword && <p style={{color: "red"}}> la confirmation du mot de passe est incorrect </p>}
	</div>)
}
