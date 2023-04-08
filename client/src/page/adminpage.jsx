import React, { useState } from "react";
import authAPI from "../services/authAPI";
import { ParkingsStaff, StaffList, UserList, Separation, CreateSpotType } from "../components";
import { Button } from "@mui/material";
import "../css/admin.css"

export function AdminPage() {

	return(<div>
		<div>
			<ParkingsStaff/>
			<CreateSpotType/>
		</div>
		<br/><br/><hr/>
		<div className="searchs">
			<StaffList/>
			<div className="UserList">
				<UserList/>
				<Separation value="Ajouter un rôle"/>
				<Button classvariant="contained" color="primary"
				style={{
					backgroundColor: "#FE434C",
					borderColor: "transparent",
					borderRadius: 20,
					fontSize:100,
					color:"#3F51B5",
					width: "50%",
					height:"20%",
					margin:"75px",
					alignSelf:"center",
				}}>+</Button>
			</div>
		</div>
		<br/><br/><hr/>
	</div>)
}
