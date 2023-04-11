import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { authenticate } from "../services/auth_api";

export function AuthenticationForm() {
	const [mail, setMail] = useState("")
	const navigate = useNavigate();

	const handlleSubmit = async (event) => {
		event.preventDefault();
		console.log(mail);
		const data = {identifier: mail, password: "a"};
		const res = await authenticate(data);
		if(res.data.code === "E_UNDEFINED_USER"){
			navigate("/registration", {state: {mail: mail}});
		}else if(res.data.code === "E_WRONG_PASSWORD"){
			navigate("/connection", {state: {mail: mail}});
		}
	}

	return(<div className="form_div">
		<form onSubmit={handlleSubmit} className="form">
			<div className="inputs_divs">
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
				className="submit_button"
				variant="contained" 
				color="primary" 
				type="submit"
			>Login</Button>
		</form>
	</div>)
}
