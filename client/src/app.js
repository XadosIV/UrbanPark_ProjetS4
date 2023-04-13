import React, { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material"
import { AppRoutes } from "./app_routes"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import { EndPage } from "./components"
import { ContextUser, initialState } from "./contexts/context_user"

export function App() {
	const [ userId, setUserId ] = useState(initialState.userId);
	const [ userToken, setUserToken ] = useState(initialState.userToken);
	const [ userRole, setUserRole ] = useState(initialState.userRole);
	const [ userPermissions, setUserPermissions ] = useState(initialState.userPermissions);

	// default state for the session
	useEffect(() => {
		window.sessionStorage.setItem("userId", undefined);
		window.sessionStorage.setItem("userToken", undefined);
		window.sessionStorage.setItem("userRole", undefined);
		window.sessionStorage.setItem("userPermissions", undefined);
	}, [])

	// update the session with the data from the context if the context isn't undefined otherwise update the contexte with the data from the session
	useEffect(() => {
		async function fetchId(){		
			if(userId !== undefined){
				window.sessionStorage.setItem("userId", userId);
			}else{
				setUserId(window.sessionStorage.getItem("userId"));
			}
		}
		fetchId();
	}, [userId]);

	useEffect(() => {
		console.group("token");
		console.log(userToken);
		async function fetchToken(){
			if(userToken !== undefined){
				window.sessionStorage.setItem("userToken", userToken);
			}else{
				setUserToken(window.sessionStorage.getItem("userToken"));
			}
		}
		fetchToken();
		console.log(userToken);
		console.groupEnd();
	}, [userToken, setUserToken]);

	useEffect(() => {
		if(userRole !== undefined){
			window.sessionStorage.setItem("userRole", userRole);
		}else{
			setUserRole(window.sessionStorage.getItem("userRole"));
		}
	}, [userRole]);
	
	useEffect(() => {
		if(userPermissions !== undefined){
			window.sessionStorage.setItem("userPermissions", JSON.stringify(userPermissions));
		}else{
			if(userPermissions !== undefined){
				setUserPermissions(JSON.parse(window.sessionStorage.getItem("userPermissions")));
			}
		}
	}, [userPermissions]);

	return (
		<ContextUser.Provider value={{ userId, setUserId, userToken, setUserToken, userRole, setUserRole, userPermissions, setUserPermissions }}>
		<Box
			sx={{ padding: 2, minHeight: "100%",
				display: "grid",
				gridTemplateRows: "auto 1fr auto",
				 }}
		>
			<header>
				<Stack
					direction="flex"
					justifyContent="space-around"
					alignItems="center"
					spacing={2}

					sx={{
						marginBottom: 2,
					}}
				>
					<Link to="/">
						<Typography variant="h3">Logo</Typography>
					</Link>
					<Link to="/authentication">
						<AccountCircleIcon variant="contained" sx={{ width: '20%', height: '20%' }} />
					</Link>
				</Stack>
			</header>
			<AppRoutes />
			<EndPage/>
		</Box>
		</ContextUser.Provider>
	)
}

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
