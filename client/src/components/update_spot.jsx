import React, { useState } from "react";
import Select from "react-select";
import { Button } from "@mui/material";

export function UpdateSpot (props) {
	const [ typeList, setTypeList ] = useState(props.used);
	const allTypes = props.allTypes;
	console.log(allTypes)

	const handleChangeSelect = (event) => {
        var value = event.value;
        setTypeList(values => ({...values, value}))
    }

	const handleSubmit = (event) => {
		console.log(typeList)
	}

	return (
		<form>
			<Select
				isMulti
				name="types"
				placeholder="Choisir des types"
				options={allTypes}
				className="search-add-two "
				onChange={event => handleChangeSelect(event)}
				defaultValue={[typeList]}
			/>
			<Button onClick={event => handleSubmit(event)}/>
		</form>
	)
}