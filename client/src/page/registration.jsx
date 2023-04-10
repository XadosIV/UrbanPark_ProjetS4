import React from "react";
import { useLocation } from "react-router-dom";
import { GoBack, RegistrationForm } from "../components";

export function Registration() {
	const { state } = useLocation();

	return(<div>
		<GoBack />
		<h1>Inscription</h1>
        <RegistrationForm mail={state.mail}/>
	</div>)
}
