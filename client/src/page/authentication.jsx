import React from "react";
import { AuthenticationForm, HomeButton } from "../components";
import "../css/auth.css";

export function Authentication() {

	return(<div className="main">
		<HomeButton />
		<h1 className="form_title">Authentification</h1>
		<AuthenticationForm />
	</div>)
}
