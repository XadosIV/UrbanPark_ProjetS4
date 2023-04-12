import React from "react";
import { AuthenticationForm, GoBack } from "../components";
import "../css/auth.css";

export function Authentication() {

	return(<div className="main">
		<GoBack />
		<h1 className="form_title">Authentification</h1>
		<AuthenticationForm />
	</div>)
}
