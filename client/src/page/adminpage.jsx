import React, { useState } from "react";
import authAPI from "../services/authAPI";
import { ParkingsStaff, StaffList, UserList } from "../components";
import "../css/admin.css"

export function AdminPage() {

	return(<div>
        <ParkingsStaff/>
		<br/><br/><hr/>
		<div className="searchs">
			<StaffList/>
			<UserList/>
		</div>
		<br/><br/><hr/>
	</div>)
}
