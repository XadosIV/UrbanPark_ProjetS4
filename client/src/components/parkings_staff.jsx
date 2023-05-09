import React, { useState, useEffect } from "react";
import { ParkingList } from "./parking_list";
import { Button, TextField } from "@mui/material";
import Popup from 'reactjs-popup';
import { CreationParking, TakeParking } from "../services"

export function ParkingsStaff({admin}) {

	function Callback(childData) {
		setUpdate(childData)
	}

	const [parkingsList, setParkingsList] = useState([]);

	const [wrongInput, setWrongInput] = useState(false);
	const [errMessage, setErrMessage] = useState("");

	const [update, setUpdate] = useState(true);

	const [infos, setInfos] = useState({id:"", name:"", floors:0, address:""})

	useEffect(() => {
		TakeParking().then(res => {setParkingsList(res);})
		setUpdate(false)
	}, [update]);

	const handleChange = (event) => {
        const name = event.target.name;
        var value = event.target.value;
		setInfos(values => ({...values, [name]: value}))
    }

	const handlleSubmit = async (event) => {
        event.preventDefault()
        setWrongInput(false);
		const res = await CreationParking(infos); 
		console.log(res);
		if (res.status === 200) {
			setWrongInput(true);
			setErrMessage("Parking " + infos.name + " créé");
			setUpdate(true)
		} else {
			setWrongInput(true);
			setErrMessage(res.data.message);
		}
	}

	return (<div>
            <div className="title-parkings">
                <h1>Les parkings</h1>
            </div>
			<div className="parking-list">
				{
					parkingsList.map((parking, index) => (
						<ParkingList key={index} parking={parking} button={true} admin={admin} handleCallback={Callback} />
					))
				}
			</div>
			{ admin &&
			<Popup trigger={<Button variant="contained" color="primary" 
			style={{
				backgroundColor: "#FE434C",
				borderColor: "transparent",
				borderRadius: 20,
				width: 250,
				float:"right",
				height:"120%"
			}}>Ajouter un parking</Button>} position="left center" onClose={() => setWrongInput(false)}>
				<div className="form_div">
					<h3 style={{textAlign:"center"}}>Ajout d'un nouveau parking</h3>
					<form onSubmit={handlleSubmit} className="form">   
						<div className="input-div">
							<div><TextField
								required
								id="id"
								label="Code (Lettre des places)"
								type="text"
								name="id"
								onChange={ handleChange }
							/></div>
							<div><TextField
								required
								id="name"
								label="Nom du parking"
								type="text"
								name="name"
								onChange={ handleChange }
							/></div>
							<div><TextField
								required
								id="floors"
								label="Nombre d'étages"
								type="number"
								name="floors"
								onChange={ handleChange }
							/></div>
							<div><TextField
								required
								id="address"
								label="Adresse (Num allée code ville)"
								type="text"
								name="address"
								onChange={ handleChange }
							/></div>	
							<Button 
								className="submit_button"
								variant="contained" 
								color="primary" 
								type="submit"
							>Ajouter le parking</Button>
						</div>
					</form>
					{ wrongInput && <p className="err-message" style={{maxWidth:"450px"}}> { errMessage } </p>}
				</div>    
			</Popup>}
		</div>)
}
