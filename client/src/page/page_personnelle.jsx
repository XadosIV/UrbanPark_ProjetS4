import React, { useContext, useEffect, useState } from "react";
import { InfosUser } from "../components/infos_user";
import "../css/page-perso.css";
import { ContextUser } from "../contexts/context_user";
import { userFromToken } from "../services";

export function PagePersonnelle(){
	const [ roleUser, setRoleUser ] = useState("");
	const { userToken } = useContext(ContextUser);

	useEffect(() => {
		async function fetchUserRole() {
            const resRoleUser = await userFromToken(userToken);
            setRoleUser(resRoleUser.data[0].role);
        }
        fetchUserRole();
	}, []);

	return<div>
		<h1>Page Personelle</h1>
		<InfosUser role={roleUser}/> 
	</div>
}
