import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { ServiceUpdateParking } from "../services";
import ReactModal from "react-modal";

export function UpdateParking (props) {
	const base = props.used;
	console.log(base);
	const [name, setNewName] = useState(base.nom);
	const [floor, setNewFloor] = useState(base.floor);
	const [address, setNewAddress] = useState(base.address);
	const [isOpen, setIsOpen] = useState(false);

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

	const HandleAskChange = () => {
		setIsOpen(true);
		props.askChange();
	}

	const customStyles = {
        overlay: {
            zIndex : 100000
        },
        content: {
            top: '35%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection:"column",
            marginRight: '-50%',
            width: '30%',
            transform: 'translate(-40%, -10%)'
        }
    };
	const inputStyle = {
		width: "100%",
		margin: "1%"
	}

	return (<div style={{marginTop: "20px"}}>
		<Button variant="contained" color="primary" onClick={HandleAskChange}>
				Modifier le parking
		</Button>
		<ReactModal
			ariaHideApp={false}
			isOpen={isOpen}
			contentLabel="modif-parking"
			onRequestClose={() => setIsOpen(false)}
			style={customStyles}
		>
			<form style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection:"column",
				width: "100%"
			}}>
				<TextField
					name="nom"
					placeholder="Choisir le nom du parking"
					defaultValue={name}
					onChange={event => handleNameChanged(event)}
					style={inputStyle}
				/>
				<TextField
					name="floor"
					placeholder="Choisir le nombre d'étages du parking"
					defaultValue={floor}
					onChange={event => handleFloorChanged(event)}
					type="number"
					style={inputStyle}
				/>
				<TextField
					name="floor"
					placeholder="Choisir l'addresse du parking"
					defaultValue={address}
					onChange={event => handleAddressChanged(event)}
					style={inputStyle}
				/>
				<Button variant="contained" color="primary" onClick={handleSubmit}>
					Modifier le parking
				</Button>
			</form>
		</ReactModal>
	</div>)
}