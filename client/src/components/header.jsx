import React from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Stack, Typography } from "@mui/material"

export function Header () {
	return(
		<div class="container" style={{
				display:"flex",
				flexDirection:"row",
				justifyContent:"space-around",
				alignItems:"center"
			}}>
			<Link to="/">
				<Typography variant="h3">Logo</Typography>
			</Link>
			<Link to="/perso" style={{
					display:"flex",
					flexDirection:"row",
					justifyContent:"flex-end"
				}}>
				<AccountCircleIcon variant="contained" sx={{ width: '20%', height: '20%' }} />
			</Link>
		</div>
	)
}