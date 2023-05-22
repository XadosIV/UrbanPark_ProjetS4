import React, { useContext, useState } from "react";
import { ParkingsStaff, StaffList, UserList, CreateSpotType, NewScheduleForm, EmployeeRegistrationForm } from "../components";
import { ContextUser } from "../contexts/context_user";
import "../css/admin.css"

export function AdminPage() {
	const {userRole} = useContext(ContextUser);
	const admin = userRole === "Gérant";

	const [update, setUpdate] = useState(true)

	function Callback(childData) {
		setUpdate(childData)
	}

	return(<div style={{overflowX:"hidden"}}>
		<div style={{minWidth:"50%"}}>
			<ParkingsStaff admin={admin} />
			<div style={{marginLeft:"40px"}}>
				<CreateSpotType/>
			</div>
		</div>
		<br/><br/><hr/><br/><br/>
		<NewScheduleForm handleCallback={Callback}/>
		<EmployeeRegistrationForm />
		<br/><br/><hr/>
		<div className="searchs">
			<StaffList update={update} admin={admin}/>
			<div style={{minWidth:"50%"}}>
				<UserList />
			</div>
		</div>
	</div>)
}