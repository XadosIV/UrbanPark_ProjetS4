import React, { useState } from "react";
import authAPI from "../services/authAPI";

import { Button, TextField } from "@mui/material";
import { ParkingsPersonnel } from "../components";

export function AdminPage() {
	const [infos, setInfos] = useState({
		identifier: "",
		password:""
	})

	const handleChange = ({currentTarget}) => {
		const {value, name} = currentTarget;
		setInfos({
			...infos,
			[name]: value
		})
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		try{
			await authAPI.authenticate(infos)
		} catch(error){
			console.log(error)
		}
	}

	return(<div>
        <ParkingsPersonnel/>
	</div>)
}