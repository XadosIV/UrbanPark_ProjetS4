import React from "react";
import { ParkingsStaff, StaffList, UserList, Separation, CreateSpotType } from "../components";
import { Button } from "@mui/material";
import "../css/admin.css"

export function AdminPage() {

	return(<div>
		<div style={{minWidth:"50%"}}>
			<ParkingsStaff admin={true} />
			<CreateSpotType/>
		</div>
		<br/><br/><hr/>
		<div className="searchs">
			<StaffList/>
			<div style={{minWidth:"50%"}}>
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
					margin:"50px 25%",
					alignSelf:"center",
				}}>+</Button>
			</div>
		</div>
	</div>)
}
