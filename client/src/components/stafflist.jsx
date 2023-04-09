import React, { useState, useEffect } from "react";
import axios from "axios";
import { StaffPreview } from "./staffpreview";
import { Separation } from "./separation";
import { TextField } from "@mui/material";

export function StaffList() {

	const [guardiansList, setGuardiansList] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:3001/api/guardians").then((res) => 
			setGuardiansList(res.data)
		)}, []);

	const [serviceList, setServiceList] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:3001/api/service").then((res) => 
			setServiceList(res.data)
		)}, []);

	const [inputTextGuadrians, setInputTextGuardians] = useState("");

	let inputHandlerGuardians = (e) => {
		var lowerCase = e.target.value.toLowerCase();
		setInputTextGuardians(lowerCase);
	};

	const [inputTextService, setInputTextService] = useState("");

	let inputHandlerService = (e) => {
		var lowerCase = e.target.value.toLowerCase();
		setInputTextService(lowerCase);
	};

	return (<div className="StaffList">
			<Separation value="Les gardiens"/>
			
			<TextField
				style = {{"marginBottom":"20px", width:"200px", alignSelf:"center"}}
				id="searchbarStaff"
				label="Rechercher..."
				type="text"
				name="searchbarStaff"
				onChange={inputHandlerGuardians}
			/>
			<StaffPreview list={guardiansList} input={inputTextGuadrians}/>
			<Separation value="Les agents d'entretien"/>
			
			<TextField
				style = {{"marginBottom":"20px", width:"200px", alignSelf:"center"}}
				id="searchbarStaff"
				label="Rechercher..."
				type="text"
				name="searchbarStaff"
				onChange={inputHandlerService}
			/>
			<StaffPreview list={serviceList} input={inputTextService}/>
		</div>)
}
