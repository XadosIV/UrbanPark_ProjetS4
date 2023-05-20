import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Typography } from "@mui/material";
import { NotifBell } from "."
import { ContextUser } from "../contexts/context_user";

export function Header () {
	const { userToken, userId } = useContext(ContextUser)

	return(
		<div className="container" style={{
				display:"flex",
				flexDirection:"row",
				justifyContent:"space-around",
				alignItems:"center",
				margin:"1%"
			}}>
			<Link to="/">
				<Typography variant="h3">UrbanPark</Typography>
			</Link>
			{ !!userToken && !!userId && <NotifBell userId={userId}/> }
			<Link to="/perso" style={{
					display:"flex",
					flexDirection:"row",
					justifyContent:"flex-end"
				}}>
				<AccountCircleIcon variant="contained" sx={{ fontSize:"4rem" }} />
			</Link>
		</div>
	)
}