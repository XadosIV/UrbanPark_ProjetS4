import React, { useContext, useEffect, useState } from "react";
import { ContextUser } from "../contexts/context_user";
import { userFromToken } from "../services";

export function InfosUser(){
    const { userToken } = useContext(ContextUser);
    const [ infosUser, setInfosUser ] = useState({
        email: "",
        first_name: "",
        id: undefined,
        id_spot: undefined,
        id_spot_temp: undefined,
        last_name: "",
        role: "",
    });

    useEffect(() => {
        async function fetchUserInfos() {
            const resInfosUser = await userFromToken(userToken);
            setInfosUser(resInfosUser.data[0]);
        }
        fetchUserInfos();
    }, [userToken, setInfosUser]);

    // à ajouter : vue de la place fait par mathys
	return<div>
        <ul>
            <li>Prénom : { infosUser.first_name }</li>
            <li>Nom : { infosUser.last_name }</li>
            <li>Email : { infosUser.email }</li>
        </ul>
	</div>
}
