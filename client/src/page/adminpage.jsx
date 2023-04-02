import React, { useState } from "react";
import authAPI from "../services/authAPI";
import { ParkingsStaff, StaffList, SearchUser } from "../components";

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
        <ParkingsStaff/>
		<br/><br/><hr/>
		<StaffList/>
		<br/><br/><hr/>
		<SearchUser/>
	</div>)
}
