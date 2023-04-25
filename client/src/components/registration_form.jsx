import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { creationCompte, authenticate, userFromToken } from "../services";
import { useUpdateContext } from "../interface";

export function RegistrationForm(props) {
	const [infos, setInfos] = useState({email: props.mail, first_name: "", last_name: "", password: "", password_conf: ""});
	const [wrongInput, setWrongInput] = useState(false);
	const [errMessage, setErrMessage] = useState("");
	const updateContext = useUpdateContext();

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
			if(res.status === 200){
				const tokenData = {
					identifier: infos.email,
					password: infos.password
				};
				const resToken = await authenticate(tokenData);
				console.log(resToken);
				if(resToken.status === 200){
					const resUser = await userFromToken(resToken.data.token);
					console.log(resUser);
					if(resUser.data.length === 1){
						const contextData = {
							id: resUser.data[0].id,
							token: resToken.data.token,
							role: resUser.data[0].role
						};
						updateContext(contextData);
					}
					setWrongInput(true);
					setErrMessage("une erreur est survenue");
				}
				setWrongInput(true);
				setErrMessage("une erreur est survenue");
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

	const noPaste = (e) => {
		e.preventDefault();
		return false;
	}

	return(<div className="form_div">
		<form onSubmit={handlleSubmit} className="form">
			<div className="inputs_divs">
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
					onPaste={ noPaste }
				/>
                <TextField
					required
					id="password_conf"
					label="confirmation du mot de passe"
					type="password"
					name="password_conf"
					onChange={handleChange}
					onPaste={ noPaste }
				/>
			</div>
			<Button 
				className="submit_button"
				variant="contained" 
				color="primary" 
				type="submit"
			>inscription</Button>
		</form>
		{ wrongInput && <p className="err_message"> { errMessage } </p>}
	</div>)
}
