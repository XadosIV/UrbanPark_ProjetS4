import React from "react";
import { useLocation } from "react-router-dom";
import { GoBack, RegistrationForm } from "../components";
import "../css/auth.css";

export function Registration() {
	const { state } = useLocation();

	return(<div className="main">
		<GoBack />
		<h1 className="form_title">Inscription</h1>
        <RegistrationForm mail={state.mail}/>
	</div>)
}
