import React from "react";
import { useLocation } from "react-router-dom";
import { Goback, InscriptionForm } from "../components";

export function Inscription() {
	const { state } = useLocation();

	return(<div>
		<Goback />
		<h1>Inscription</h1>
        <InscriptionForm mail={state.mail}/>
	</div>)
}
