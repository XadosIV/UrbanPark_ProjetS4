import React, { useContext, useEffect, useState } from "react";
import { ContextUser } from "../contexts/context_user";
import { userFromToken, placeFromId } from "../services";
import { Button, TextField } from "@mui/material";
import { SpotName } from "../interface/spot_name";

export function InfosUser(props){
    const { userToken } = useContext(ContextUser);
    const [ infosUser, setInfosUser ] = useState({
        email: "",
        first_name: "",
        id: undefined,
        id_spot: null,
        id_spot_temp: null,
        last_name: "",
        role: "",
    });
    const [ maPlace, setMaPlace ] = useState({
        id: undefined,
	    number: undefined,
	    floor: undefined,
	    id_park: "",
	    id_user: undefined,
	    types:[]
    });
    const [ affFormModifInfo, setAffFormModifInfo ] = useState(false);
    const [ affMaPlace, setAffMaPlace ] = useState(false);
    const [ newInfos, setNewInfos ] = useState({});

    useEffect(() => {
        async function fetchUserInfos() {
            const resInfosUser = await userFromToken(userToken);
            setInfosUser(resInfosUser.data[0]);
        }
        fetchUserInfos();
    }, [userToken, setInfosUser]);
    
    useEffect(() => {
        console.log("upPlace", infosUser)
        async function fetchMaPlace() {
            const id_place = infosUser.id_spot === null ? infosUser.id_spot_temp : infosUser.id_spot;
            if(id_place != null){
                const resMaPlace = await placeFromId(id_place);
                console.log("place", resMaPlace.data[0]);
                setMaPlace(resMaPlace.data[0]);
            }
        }
        fetchMaPlace();
    }, [infosUser, setMaPlace]);

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
            { (props.role === "Abonné") &&
            <Button 
                classvariant="contained"
                color="primary"
                className="modif-infos-button"
                onClick={ () => {
                    setAffFormModifInfo(false);
                    affMaPlace ? setAffMaPlace(false) : setAffMaPlace(true);
                } }
                style={{
                    backgroundColor: "#145EA8",
                    color:"#FFFFFF"
                }}
            > Ma Place </Button> }
            <Button 
                classvariant="contained"
                color="primary"
                className="modif-infos-button"
                onClick={ () => {
                    setAffMaPlace(false);
                    affFormModifInfo ? setAffFormModifInfo(false) : setAffFormModifInfo(true);
                } }
                style={{
                    backgroundColor: "#145EA8",
                    color:"#FFFFFF"
                }}
            > modifier mes informations </Button>
            </div>
            { /*affFormModifInfo*/ false && 
                // TODO changer pour avoir un form pour update le mdp et un autre pour le reste
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
            { affMaPlace &&
                <div className="div-info-place">
                    <h3> { maPlace.id_park && maPlace.floor && maPlace.number && SpotName(maPlace)  } { !maPlace.id_park && !maPlace.floor && !maPlace.number && "Place Indisponible" } </h3>
                    <ul>
                        { maPlace.types.map( (type, index) => <li key={index} > { type } </li> ) }
                    </ul>
                </div>
            }
	</div>
}
