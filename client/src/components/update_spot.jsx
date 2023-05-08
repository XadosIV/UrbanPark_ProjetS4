import React, { useState } from "react";
import Select from "react-select";
import { Button } from "@mui/material";
import { ServiceUpdateSpot } from "../services/update_spot";

export function UpdateSpot (props) {
	const base = props.used;
	const [ typeList, setTypeList ] = useState(props.used);
	const allTypes = props.allTypes;
	
	function AllTypes(list) {
        var opt = []
        for (let i=0; i<list.length; i++) {
            opt.push({value:list[i].name, label:list[i].name})
        }
        return opt
    }

	const handleChangeSelect = (event) => {
		let modif = []
		for (let type of event) {
			modif.push({name:type.value})
		}
		setTypeList(values => (modif));
    }

	const handleSubmit = (event) => {
		let changes = [];
		for (let typeL of typeList){
			let trouve = false;
			for (let typeB of base){
				if (typeL.name === typeB.name){
					trouve = true;
				}
			}
			if (!trouve){
				changes.push(typeL.name);
			}
		}
		for (let typeB of base){
			let trouve = false;
			for (let typeL of typeList){
				if (typeL.name === typeB.name){
					trouve = true;
				}
			}
			if (!trouve){
				changes.push(typeB.name);
			}
		}
		ServiceUpdateSpot(changes, props.id);
		props.handleCallback(true);
		props.handleChangeView()
	}

	return (
		<form>
			<Select
				isMulti
				name="types"
				placeholder="Choisir des types"
				options={AllTypes(allTypes)}
				className="search-add-two "
				defaultValue={AllTypes(base)}
				onChange={event => handleChangeSelect(event)}
			/>
			<Button variant="contained" color="primary" onClick={handleSubmit}>
				Modifier les types
			</Button>
		</form>
	)
}