import React from "react";
import { AuthenticationForm, GoBack } from "../components";
import "../css/auth.css";

export function Authentication() {

	return(<div className="main">
		<h1 className="form_title">Authentification</h1>
		<AuthenticationForm />
		<GoBack />
	</div>)
}
