import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { creationCompte, authenticate, userFromToken, TakeParking } from "../services";
import { useUpdateContext, isValideNom } from "../interface";
import Select from 'react-select';;

export function RegistrationForm(props) {
	const [infos, setInfos] = useState({email: props.mail, first_name: "", last_name: "", password: "", password_conf: "", id_park_demande: ""});
	const [wrongInput, setWrongInput] = useState(false);
	const [errMessage, setErrMessage] = useState("");
	const [ parkings, setParkings ] = useState([]);
	const [ optParking, setOptParking ] = useState([]);
	const updateContext = useUpdateContext();

	useEffect(() => {
		async function fetchParkings(){
			let resParking = await TakeParking();
			setParkings(resParking);
		}
		fetchParkings();
	}, [])

	useEffect(() => {
		if(parkings){
			let newOptPark = [];
			let newLabel = "";
			parkings.forEach(park => {
				newLabel = <div><p>{park.name}</p><h6>{park.address}</h6></div>;
				newOptPark.push({value: park.id, label: newLabel});
			});
			setOptParking(newOptPark);
		}
	}, [parkings])

	const handlleSubmit = async (event) => {
		event.preventDefault();
		if(infos.password !== infos.password_conf){
			setWrongInput(true);
			setErrMessage("La confirmation du mot de passe est invalide");
		}else if(!isValideNom(infos.first_name) || !isValideNom(infos.last_name)){
			setWrongInput(true);
			setErrMessage("Nom ou prénom invalide");
		}else{
			setWrongInput(false);
			const res = await creationCompte(infos);
			if(res.status === 200){
				const tokenData = {
					identifier: infos.email,
					password: infos.password
				};
				const resToken = await authenticate(tokenData);
				if(resToken.status === 200){
					const resUser = await userFromToken(resToken.data.token);
					if(resUser.data.length === 1){
						const contextData = {
							id: resUser.data[0].id,
							token: resToken.data.token,
							role: resUser.data[0].role
						};
						updateContext(contextData);
					}
					setWrongInput(true);
					setErrMessage("Une erreur est survenue");
				}
				setWrongInput(true);
				setErrMessage("Une erreur est survenue");
			}else{
				setWrongInput(true);
				setErrMessage(res.data.message);
			}
		}
	}

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

	const handleChangeSelect = (selectedOptions, nom) => {
		const name = nom.name;
		const value = selectedOptions.value;
		setInfos(values => ({...values, [name]: value}));
	}

	const noPaste = (e) => {
		e.preventDefault();
		return false;
	}

	return(<div className="form_div">
		<form onSubmit={handlleSubmit} className="form">
			<div className="inputs-divs">
				<div><TextField
					required
					id="last_name"
					label="Nom"
					type="text"
					name="last_name"
					onChange={handleChange}
				/></div>
				<div><TextField
					required
					id="first_name"
					label="Prénom"
					type="text"
					name="first_name"
					onChange={handleChange}
				/></div>
                <div><TextField
					required
					id="email"
					label="email"
					type="email"
					name="email"
					defaultValue={props.mail}
					onChange={handleChange}
				/></div>
                <div><TextField
					required
					id="password"
					label="mot de passe"
					type="password"
					name="password"
					onChange={handleChange}
					onPaste={ noPaste }
				/></div>
                <div><TextField
					required
					id="password_conf"
					label="confirmation du mot de passe"
					type="password"
					name="password_conf"
					onChange={handleChange}
					onPaste={ noPaste }
				/></div>
				<div><Select 
					required
					name="id_park_demande"
					className="select-park-abo"
					placeholder="parking demandé"
					options={ optParking }
					onChange={handleChangeSelect}
				/></div>

			</div>
			<Button 
				className="submit_button"
				variant="contained" 
				color="primary" 
				type="submit"
			>inscription</Button>
		</form>
		{ wrongInput && <p className="err_message"> { errMessage } </p>}
	</div>)
}

/*
<div><Select 
	required
	name="type_demande"
	className="select-park-abo"
	placeholder="parking demandé"
	options={ optTypes }
	onChange={handleChangeSelect}
/></div>
*/
