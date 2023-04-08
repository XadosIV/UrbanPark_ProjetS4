import React, { useState } from "react";
import { Button, TextField } from "@mui/material";

export function InscriptionForm(props) {
	const [infos, setInfos] = useState({mail: props.mail});

	const handlleSubmit = (event) => {
		event.preventDefault();
		console.log(infos);
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
					id="mail"
					label="mail"
					type="text"
					name="mail"
					defaultValue={props.mail}
					onChange={handleChange}
				/>
				<TextField
					required
					id="name"
					label="nom"
					type="text"
					name="name"
					onChange={handleChange}
				/>
                <TextField
					required
					id="surname"
					label="prenom"
					type="text"
					name="surname"
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
	</div>)
}