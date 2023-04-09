import React from "react";
import { Box, Stack, Typography } from "@mui/material"
import { AppRoutes } from "./approutes"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import { EndPage } from "./components"

export function App() {
	return (
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
					<Link to="/authentification">
						<AccountCircleIcon variant="contained" sx={{ width: '20%', height: '20%' }} />
					</Link>
				</Stack>
			</header>
			<AppRoutes />
			<EndPage/>
		</Box>
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
