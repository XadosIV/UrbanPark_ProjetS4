import { useContext, useEffect, useState } from "react";
import { PagePersoAbonne, InfosPersonelles } from "../components";
import "../css/page-perso.css";
import { ContextUser } from "../contexts/context_user";
import { userFromToken } from "../services";
import { AdminPage } from "./admin_page";


export function PagePersonnelle(){
	const { userToken } = useContext(ContextUser);
	const [ roleUser, setRoleUser ] = useState("");

	useEffect(() => {
        async function fetchUserInfos() {
            const resUserToken = await userFromToken(userToken);
            setRoleUser(resUserToken.data[0].role);
            //console.log("token", resUserToken.data[0])
        }
        fetchUserInfos();
    }, [userToken]);

	const persoParRole = () => {
		switch (roleUser) {
			case "Abonné":
				return <PagePersoAbonne />;
			case "Gérant":
				return <AdminPage />;
			default:
				return null;
		}
	};

	return<div>
		<h1>Page Personelle</h1>
		<InfosPersonelles />
		{
			persoParRole()
		}
	</div>
}
