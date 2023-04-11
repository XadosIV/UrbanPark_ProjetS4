import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { authenticate } from "../services/auth_api";

export function ConnectionForm(props) {
	const [infos, setInfos] = useState({mail: props.mail, password: ""});
	const [wrongInput, setWrongInput] = useState(false);
	const navigate = useNavigate();

	const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

	const handlleSubmit = async (event) => {
		event.preventDefault();
		console.log(infos);
		const data = {identifier: infos.mail, password: infos.password};
		const res = await authenticate(data);
		if(res.status === 200){
			navigate("/");
		}else{
			setWrongInput(true);
		}
	}

	return(<div className="form_div">
		<form onSubmit={handlleSubmit} className="form">
			<div className="inputs_divs">
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
				className="submit_button" 
				variant="contained" 
				color="primary" 
				type="submit"
			>connexion</Button>
		</form>
		{ wrongInput && <p className="err_message"> votre mot de passe ou mail n'est pas valide </p> }
	</div>)
}
