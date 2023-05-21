import React, { useState, useEffect } from "react";
import { StaffPreview, Separation, EmployeeRegistrationForm } from "./";
import { TextField } from "@mui/material";
import { InputHandler } from "../interface"
import { TakeByRole } from "../services"

export function StaffList(props) {

	const [guardiansList, setGuardiansList] = useState([]);
	const [serviceList, setServiceList] = useState([]);

	useEffect(() => {
		TakeByRole("Gardien").then(res => {setGuardiansList(res);})
		TakeByRole("Agent d'entretien").then(res => {setServiceList(res);})
	}, []);

	const [inputTextGuadrians, setInputTextGuardians] = useState("");
	const [inputTextService, setInputTextService] = useState("");

	return (<div className="StaffList">
			{
				props.admin && <EmployeeRegistrationForm/>
			}
			<Separation value="Les gardiens"/>
			
			<TextField
				style = {{"marginBottom":"20px", width:"200px", alignSelf:"center"}}
				id="searchbarGuardians"
				label="Rechercher..."
				type="text"
				name="searchbarGuardians"
				onChange={InputHandler(setInputTextGuardians)}
			/>
			<StaffPreview list={guardiansList} input={inputTextGuadrians} update={props.update}/>
			<Separation value="Les agents d'entretien"/>
			
			<TextField
				style = {{"marginBottom":"20px", width:"200px", alignSelf:"center"}}
				id="searchbarService"
				label="Rechercher..."
				type="text"
				name="searchbarService"
				onChange={InputHandler(setInputTextService)}
			/>
			<StaffPreview list={serviceList} input={inputTextService} update={props.update}/>
		</div>)
}
