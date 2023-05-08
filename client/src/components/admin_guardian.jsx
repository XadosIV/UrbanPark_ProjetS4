import React from "react";
import { ParkingsStaff, StaffList, UserList } from ".";
import "../css/admin.css"

export function AdminGuardian() {

	return(<div style={{overflowX:"hidden"}}>
		<div style={{minWidth:"50%"}}>
			<ParkingsStaff admin={false} />
		</div>
		<br/><br/><hr/>
		<div className="searchs">
			<StaffList/>
			<div style={{minWidth:"50%"}}>
				<UserList/>
			</div>
		</div>
	</div>)
}
