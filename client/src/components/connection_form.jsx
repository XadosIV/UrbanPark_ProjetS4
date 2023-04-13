import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { authenticate, userFromToken } from "../services/";
import { useUpdateContext } from "../interface";

export function ConnectionForm(props) {
	const [infos, setInfos] = useState({mail: props.mail, password: ""});
	const [wrongInput, setWrongInput] = useState(false);
	const updateContext = useUpdateContext();

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
			console.log(res);
			const userData = await userFromToken(res.data.token);
			console.log(userData.data);
			if(userData.data.length === 1){
				const contextData = {
					id: userData.data[0].id,
					token: res.data.token,
					role: userData.data[0].role
				};
				updateContext(contextData);
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
				onPaste={ noPaste }
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
