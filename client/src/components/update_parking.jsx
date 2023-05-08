import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { ServiceUpdateParking } from "../services";

export function UpdateParking (props) {
	const base = props.used;
	console.log(base)
	const [name, setNewName] = useState(base.nom)
	const [floor, setNewFloor] = useState(base.floor)
	const [address, setNewAddress] = useState(base.address)

	const handleNameChanged = (event) => {
		setNewName(event.target.value);
		console.log(name)
    }
	const handleFloorChanged = (event) => {
		setNewFloor(parseInt(event.target.value));
		console.log(floor)
    }
	const handleAddressChanged = (event) => {
		setNewAddress(event.target.value);
		console.log(address)
    }

	const handleSubmit = (event) => {
		let changes = {
			name: name,
			floor: floor,
			address: address
		}

		console.log(changes)

		ServiceUpdateParking(changes, props.id);
		props.handleCallback(true);
		props.handleChangeView();
	}

	return (
		<form>
			<TextField
				name="nom"
				placeholder="Choisir le nom du parking"
				defaultValue={name}
				onChange={event => handleNameChanged(event)}
			/>
			<TextField
				name="floor"
				placeholder="Choisir le nombre d'étages du parking"
				defaultValue={floor}
				onChange={event => handleFloorChanged(event)}
				type="number"
			/>
			<TextField
				name="floor"
				placeholder="Choisir l'addresse du parking"
				defaultValue={address}
				onChange={event => handleAddressChanged(event)}
			/>
			<Button variant="contained" color="primary" onClick={handleSubmit}>
				Modifier le parking
			</Button>
		</form>
	)
}