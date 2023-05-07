import React, { useContext, useEffect, useState } from "react";
import { SpotName } from "../interface"
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { ContextUser } from "../contexts/context_user";
import { userFromToken, DeleteSpot, TakeAllSpotTypes } from "../services";
import { AdminVerif, UpdateSpot } from "../components"

export function Spot(props) {

    const [spotTypes, setSpotTypes] = useState([]);

	useEffect(() => {
        TakeAllSpotTypes().then(res => {setSpotTypes(res);});
    }, []);

	async function Callback(childData) {
		props.handleCallback(childData)
		await DeleteSpot(props.spot.id);
	}

	function CallBackUpdate(childData) {
		props.handleCallback(childData)
	}

	const { userToken } = useContext(ContextUser);
	const [ roleUser, setRoleUser ] = useState("");
	const admin = roleUser === "Gérant";

	useEffect(() => {
		async function fetchUserInfos() {
			const resUserToken = await userFromToken(userToken);
			setRoleUser(resUserToken.data[0].role);
			//console.log("token", resUserToken.data[0])
		}
		fetchUserInfos();
	}, [userToken]);

	/**
	 * HasSub
	 * Return a button to assign a spot if there is "Abonné" type and no user
	 * 
	 * @param { Array of Spot Types } types - The types of the spot 
	 * @param { Array of User } user - The user of the spot
	 * @returns { Button }
	 */
	function HasSub(types, user) {
		var res = false;
		if (types.length !== 0 && user == null) {
			for (let type of types) {
				if (type === "Abonné") {
					res = true;
				}
			}
		}
		if (res) {
			return <Button variant="contained" color="primary" 
			style={{
				backgroundColor: "#FE434C",
				borderColor: "transparent",
				borderRadius: 20,
				width: 160,
				float:"right",
				height:"10%",
				marginBottom:"5px"
			}}>Assigner cette place à un abonné</Button>;
		}  
	}
	
	const [ modifiable, setModifiable ] = useState(false);

	const HandleAskChange = () => {
		setModifiable(!modifiable);
	}

	function TakeAllTypeOfSpot() {
		let types = []
		for (let type of props.spot.types) {
			let info = type;
			types.push({name: info});
		}
		return types;
	}

	function HandleTypesModification() {
		let used = TakeAllTypeOfSpot();
		return (
			!modifiable && <Button variant="contained" color="primary" onClick={HandleAskChange}>
				Modifier les types
			</Button>)
			|| (
			modifiable && <div>
				<UpdateSpot allTypes={spotTypes} used={used} id={props.spot.id} handleCallback={CallBackUpdate} handleChangeView={HandleAskChange}/>
			</div>)
	}

	var infosSpot;
	if (props.spot.id_user_temp != null) {
		infosSpot = <Link to={`/users/${props.spot.id_user}/profile`} style={{textDecoration:"none", marginBottom:"10px"}}>
						Place attribuée temporairement à : <br/> {props.spot.first_name_temp} {props.spot.last_name_temp}
					</Link>
	} else if (props.spot.id_user != null) {
		infosSpot = <Link to={`/users/${props.spot.id_user}/profile`} style={{textDecoration:"none", marginBottom:"10px"}}>
						Place attribuée à : <br/> {props.spot.first_name} {props.spot.last_name}
					</Link>
	} else {
		for (let type of props.spot.types) {
			if (type === "Abonné") {	 
				infosSpot = <a id="no-hover">Cette place n'a pas d'abonné attitré</a>
			}
		}  
	}
	if (!infosSpot) {
		infosSpot = <a id="no-hover">Cette place est destinée à tous les utilisateurs</a>
	}

	var typesSpot = [];
	if (props.spot.types.length !== 0) {
		for (let type of props.spot.types) {
			typesSpot.push(<p><strong>-</strong> Place {type}<br/></p>)
		}
	}

	return (<div className="spot">
		<div className="dp">
			<Button variant="contained" color="primary" className="dropbtn" style={{width:"200px"}}>
				Place {SpotName(props.spot)}
			</Button>
			<div className="dp-content">
				{infosSpot}
				{typesSpot}
				{HasSub(props.spot.types, props.spot.id_user)}
				{ admin && HandleTypesModification()}
				{admin && 
				<AdminVerif title="Supprimer cette place" text={"Vous êtes sur le point de supprimer la place " + SpotName(props.spot) + " !"} handleCallback={Callback}/>}
			</div>
		</div>
	</div>)
}