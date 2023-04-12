import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { authenticate, userFromToken, permsFromRole } from "../services/";
import { ContexteUser } from "../contexts/contexte_user";

export function ConnectionForm(props) {
	const [infos, setInfos] = useState({mail: props.mail, password: ""});
	const [wrongInput, setWrongInput] = useState(false);
	const navigate = useNavigate();
	const { setUserId, userToken, setUserToken, setUserRole, setUserPermissions } = useContext(ContexteUser);

 	useEffect( () => {
		if(userToken !== undefined){
			navigate("/");
		}
	});

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
				setUserId(userData.data[0].id);
				setUserToken(res.data.token);
				setUserRole(userData.data[0].role);
				const perms = await permsFromRole(userData.data[0].role);
				console.log(perms);
				const permUser = {};
				for(const key in perms.data[0]){
					if(key !== "name"){
						permUser[key] = perms.data[0][key].data[0];
					}
				}
				console.log(setUserPermissions);
				setUserPermissions(permUser);
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
