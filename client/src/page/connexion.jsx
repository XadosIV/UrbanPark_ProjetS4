import React from "react";
import { useLocation } from "react-router-dom";
import { ConnexionForm, Goback } from "../components";

export function Connexion() {
	const { state } = useLocation();

	return(<div>
		<Goback />
		<h1>Connexion</h1>
        <ConnexionForm mail={state.mail}/>
	</div>)
}
