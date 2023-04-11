import React from "react";
import { useLocation } from "react-router-dom";
import { ConnectionForm, GoBack } from "../components";

export function Connection() {
	const { state } = useLocation();

	return(<div>
		<GoBack />
		<h1>Connexion</h1>
        <ConnectionForm mail={state.mail}/>
	</div>)
}
