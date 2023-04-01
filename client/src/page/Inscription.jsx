import React from "react";
import { useLocation } from "react-router-dom";
import { InscriptionForm } from "../components";

export function Inscription() {
	const { state } = useLocation();

	return(<div>
        <InscriptionForm mail={state.mail}/>
	</div>)
}