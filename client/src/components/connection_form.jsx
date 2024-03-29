import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { authenticate, userFromToken } from "../services";
import { useUpdateContext } from "../interface";
import { useNavigate } from "react-router-dom";

export function ConnectionForm(props) {
	const [infos, setInfos] = useState({mail: props.mail, password: ""});
	const [wrongInput, setWrongInput] = useState(false);
	const updateContext = useUpdateContext();
	const navigate = useNavigate();

	const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

	const handlleSubmit = async (event) => {
		event.preventDefault();
		const data = {identifier: infos.mail, password: infos.password};
		const res = await authenticate(data);
		if(res.status === 200){
			const userData = await userFromToken(res.data.token);
			if(userData.data.length === 1){
				const contextData = {
					id: userData.data[0].id,
					token: res.data.token,
					role: userData.data[0].role,
					setPerms: true
				};
				updateContext(contextData);
				navigate("/perso");
			}
		}else{
			setWrongInput(true);
		}
	}

	const noPaste = (e) => {
		e.preventDefault();
		return false;
	}

	return(<div className="form_div">
		<form onSubmit={handlleSubmit} className="form">
			<div className="inputs-divs">
			<div><TextField
				required
				id="mail"
				label="mail"
				type="email"
				name="mail"
				defaultValue={props.mail}
				onChange={handleChange}
			/></div>
			<div><TextField
				required
				id="password"
				label="mot de passe"
				type="password"
				name="password"
				onChange={handleChange}
				onPaste={ noPaste }
			/></div>
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
