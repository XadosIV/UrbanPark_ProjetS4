import React, { useState, useEffect } from "react";
import { StaffPreview } from "./staff_preview";
import { Separation } from "./separation";
import { TextField } from "@mui/material";
import { InputHandler } from "../interface"
import TBR from "../services/take_by_role"

export function StaffList() {

	const [guardiansList, setGuardiansList] = useState([]);
	const [serviceList, setServiceList] = useState([]);

	useEffect(() => {
		TBR.TakeByRole("Gardien").then(res => {setGuardiansList(res);})
	}, []);

	useEffect(() => {
		TBR.TakeByRole("Agent d'entretien").then(res => {setServiceList(res);})
	}, []);

	const [inputTextGuadrians, setInputTextGuardians] = useState("");
	const [inputTextService, setInputTextService] = useState("");

	return (<div className="StaffList">
			<Separation value="Les gardiens"/>
			
			<TextField
				style = {{"marginBottom":"20px", width:"200px", alignSelf:"center"}}
				id="searchbarStaff"
				label="Rechercher..."
				type="text"
				name="searchbarStaff"
				onChange={InputHandler(setInputTextGuardians)}
			/>
			<StaffPreview list={guardiansList} input={inputTextGuadrians}/>
			<Separation value="Les agents d'entretien"/>
			
			<TextField
				style = {{"marginBottom":"20px", width:"200px", alignSelf:"center"}}
				id="searchbarStaff"
				label="Rechercher..."
				type="text"
				name="searchbarStaff"
				onChange={InputHandler(setInputTextService)}
			/>
			<StaffPreview list={serviceList} input={inputTextService}/>
		</div>)
}
