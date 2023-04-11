import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { creationCompte } from "../services/creation_compte";
import { useNavigate } from "react-router-dom";

export function RegistrationForm(props) {
	const navigate = useNavigate();
	const [infos, setInfos] = useState({email: props.mail, first_name: "", last_name: "", password: "", password_conf: ""});
	const [wrongInput, setWrongInput] = useState(false);
	const [errMessage, setErrMessage] = useState("");

	const handlleSubmit = async (event) => {
		event.preventDefault();
		console.log(infos);
		if(infos.password !== infos.password_conf){
			setWrongInput(true);
			setErrMessage("la confirmation du mot de passe est invalide");
		}else{
			setWrongInput(false);
			const res = await creationCompte(infos);
			console.log(res);
			if(res.status === 201){
				navigate("/");
			}else{
				setWrongInput(true);
				setErrMessage(res.data.message);
			}
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
		{ wrongInput && <p style={{color: "red"}}> { errMessage } </p>}
	</div>)
}
