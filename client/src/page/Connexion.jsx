import React from "react";
import { useLocation } from "react-router-dom";
import { ConnexionForm } from "../components";

export function Connexion() {
	const { state } = useLocation();

	return(<div>
        <ConnexionForm mail={state.mail}/>
	</div>)
}