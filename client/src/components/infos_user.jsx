import React, { useContext, useEffect, useState } from "react";
import { ContextUser } from "../contexts/context_user";
import { userFromToken } from "../services";
import { Button, TextField } from "@mui/material";

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
    const [ affFormModifInfo, setAffFormModifInfo ] = useState(false);
    const [ newInfos, setNewInfos ] = useState({});

    useEffect(() => {
        async function fetchUserInfos() {
            const resInfosUser = await userFromToken(userToken);
            setInfosUser(resInfosUser.data[0]);
        }
        fetchUserInfos();
    }, [userToken, setInfosUser]);

    const noPaste = (e) => {
		e.preventDefault();
		return false;
	}

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setNewInfos(values => ({...values, [name]: value}))
    }

    const handlleSubmit = (e) => {
        e.preventDefault();
        console.log(newInfos);
    }

	return<div>
            <div className="div-info-user">
            <h3> { infosUser.first_name + " " + infosUser.last_name } </h3>
            <p> { infosUser.email } </p>
            <Button 
                classvariant="contained"
                color="primary"
                className="modif-infos-button"
                onClick={ () => {
                    affFormModifInfo ? setAffFormModifInfo(false) : setAffFormModifInfo(true);
                } }
                style={{
                    backgroundColor: "#145EA8",
                    color:"#FFFFFF"
                }}
            > modifier mes informations </Button>
            </div>
            { affFormModifInfo && 
                <form  onSubmit={ handlleSubmit }>
                    <div className="inputs_divs">
                    <TextField
                        id="email"
                        label="email"
                        type="text"
                        name="email"
                        defaultValue={infosUser.email}
                        onChange={ handleChange }
                    />
                    <TextField
                        id="first_name"
                        label="first_name"
                        type="text"
                        name="first_name"
                        defaultValue={infosUser.first_name}
                        onChange={ handleChange }
                    />
                    <TextField
                        id="last_name"
                        label="last_name"
                        type="text"
                        name="last_name"
                        defaultValue={infosUser.last_name}
                        onChange={ handleChange }
                    />
                    <TextField
                        id="new_password"
                        label="nouveau mot de passe"
                        type="password"
                        name="new_password"
                        onPaste={ noPaste }
                        onChange={ handleChange }
                    />
                    <TextField
                        id="new_password_conf"
                        label="confirmation du nouveau mot de passe"
                        type="password"
                        name="new_password_conf"
                        onPaste={ noPaste }
                        onChange={ handleChange }
                    />
                    <TextField
                        required
                        id="password"
                        label="mot de passe"
                        type="password"
                        name="password"
                        onPaste={ noPaste }
                        onChange={ handleChange }
				    />
                    </div>
                    <Button 
                        className="submit_button"
                        variant="contained" 
                        color="primary" 
                        type="submit"
                    >valider les changements</Button>
                </form>
            }
	</div>
}
